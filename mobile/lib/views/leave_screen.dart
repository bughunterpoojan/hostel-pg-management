import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../providers/student_provider.dart';
import '../models/hostel_models.dart';
import '../services/api_service.dart';

class LeaveScreen extends StatefulWidget {
  const LeaveScreen({super.key});

  @override
  State<LeaveScreen> createState() => _LeaveScreenState();
}

class _LeaveScreenState extends State<LeaveScreen> {
  final _apiService = ApiService();

  Future<void> _showApplyLeaveDialog() async {
    DateTime? startDate;
    DateTime? endDate;
    final reasonController = TextEditingController();

    await showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Apply for Leave'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                title: Text(startDate == null ? 'Select Start Date' : DateFormat('dd MMM yyyy').format(startDate!)),
                leading: const Icon(LucideIcons.calendar),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now(),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) setDialogState(() => startDate = picked);
                },
              ),
              ListTile(
                title: Text(endDate == null ? 'Select End Date' : DateFormat('dd MMM yyyy').format(endDate!)),
                leading: const Icon(LucideIcons.calendar),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: startDate ?? DateTime.now(),
                    firstDate: startDate ?? DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) setDialogState(() => endDate = picked);
                },
              ),
              TextField(controller: reasonController, decoration: const InputDecoration(labelText: 'Reason'), maxLines: 2),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                if (startDate == null || endDate == null || reasonController.text.isEmpty) return;
                try {
                  await _apiService.client.post('activity/leaves/', data: {
                    'start_date': DateFormat('yyyy-MM-dd').format(startDate!),
                    'end_date': DateFormat('yyyy-MM-dd').format(endDate!),
                    'reason': reasonController.text,
                  });
                  context.read<StudentProvider>().fetchDashboardData();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to apply leave')));
                }
              },
              child: const Text('Apply'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final student = context.watch<StudentProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('My Leaves')),
      body: student.leaves.isEmpty
          ? const Center(child: Text('No leave applications found.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: student.leaves.length,
              itemBuilder: (context, index) {
                final l = student.leaves[index];
                return _buildLeaveCard(l);
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showApplyLeaveDialog,
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Widget _buildLeaveCard(LeaveApplication leave) {
    Color color = Colors.orange;
    if (leave.status == 'approved') color = Colors.green;
    if (leave.status == 'rejected') color = Colors.red;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text('${DateFormat('dd MMM').format(leave.startDate)} - ${DateFormat('dd MMM yyyy').format(leave.endDate)}', style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(leave.reason),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
          child: Text(leave.status.toUpperCase(), style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
