import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../providers/student_provider.dart';
import '../models/hostel_models.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../utils/constants.dart';
import '../services/api_service.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  late Razorpay _razorpay;
  final _apiService = ApiService();
  int? _pendingRentId;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  Future<void> _startPayment(Rent rent) async {
    _pendingRentId = rent.id;
    try {
      // 1. Create Order on Backend
      final response = await _apiService.client.post('activity/rents/${rent.id}/create-payment/');
      
      if (response.statusCode == 200) {
        final orderData = response.data;
        
        // 2. Open Razorpay Checkout
        var options = {
          'key': AppConstants.razorpayKey,
          'amount': orderData['amount'],
          'name': 'HostelHub',
          'order_id': orderData['id'], // Use the ID from backend order
          'description': 'Rent Payment - ${DateFormat('MMMM yyyy').format(rent.month)}',
          'timeout': 60, // in seconds
          'prefill': {
            'contact': '',
            'email': '',
          }
        };

        _razorpay.open(options);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error starting payment: $e')));
    }
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    if (_pendingRentId == null) return;

    try {
      final verifyResponse = await _apiService.client.post(
        'activity/rents/$_pendingRentId/verify-payment/',
        data: {
          'razorpay_payment_id': response.paymentId,
          'razorpay_order_id': response.orderId,
          'razorpay_signature': response.signature,
        },
      );

      if (verifyResponse.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Payment verified successfully!'), backgroundColor: Colors.green),
        );
        // Refresh dashboard data
        context.read<StudentProvider>().fetchDashboardData();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Payment verification failed: $e'), backgroundColor: Colors.red),
      );
    } finally {
      _pendingRentId = null;
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Payment Failed: ${response.message}')),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('External Wallet: ${response.walletName}')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final student = context.watch<StudentProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('Payments & Rent History')),
      body: student.rents.isEmpty
          ? const Center(child: Text('No payment history found.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: student.rents.length,
              itemBuilder: (context, index) {
                final r = student.rents[index];
                return _buildRentCard(context, r);
              },
            ),
    );
  }

  Widget _buildRentCard(BuildContext context, Rent rent) {
    bool isPaid = rent.status == 'paid';
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(DateFormat('MMMM yyyy').format(rent.month), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text('Due: ${DateFormat('dd MMM').format(rent.dueDate)}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                  ],
                ),
                Text('₹${(rent.amount + rent.lateFee).toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
              ],
            ),
            const Divider(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: (isPaid ? Colors.green : Colors.orange).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                  child: Text(rent.status.toUpperCase(), style: TextStyle(color: isPaid ? Colors.green : Colors.orange, fontSize: 10, fontWeight: FontWeight.bold)),
                ),
                if (!isPaid)
                  ElevatedButton(
                    onPressed: () => _startPayment(rent),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.blue, foregroundColor: Colors.white, visualDensity: VisualDensity.compact),
                    child: const Text('Pay Now'),
                  )
                else
                  const Row(
                    children: [
                      Icon(LucideIcons.checkCircle, color: Colors.green, size: 16),
                      SizedBox(width: 4),
                      Text('Paid', style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
                    ],
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
