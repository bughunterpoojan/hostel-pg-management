import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../providers/student_provider.dart';
import '../models/hostel_models.dart';
import '../services/api_service.dart';

class ComplaintsScreen extends StatefulWidget {
  const ComplaintsScreen({super.key});

  @override
  State<ComplaintsScreen> createState() => _ComplaintsScreenState();
}

class _ComplaintsScreenState extends State<ComplaintsScreen> {
  final _apiService = ApiService();

  void _showAddComplaintDialog() {
    final titleController = TextEditingController();
    final descController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Raise Complaint'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Title')),
            TextField(controller: descController, decoration: const InputDecoration(labelText: 'Description'), maxLines: 3),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () async {
              try {
                await _apiService.client.post('activity/complaints/', data: {
                  'title': titleController.text,
                  'description': descController.text,
                });
                context.read<StudentProvider>().fetchDashboardData();
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Complaint raised successfully')));
              } catch (e) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Failed to raise complaint')));
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final student = context.watch<StudentProvider>();
    return Scaffold(
      appBar: AppBar(title: const Text('My Complaints')),
      body: student.complaints.isEmpty
          ? const Center(child: Text('No complaints found.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: student.complaints.length,
              itemBuilder: (context, index) {
                final c = student.complaints[index];
                return _buildComplaintCard(c);
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddComplaintDialog,
        child: const Icon(LucideIcons.plus),
      ),
    );
  }

  Widget _buildComplaintCard(Complaint complaint) {
    Color color = Colors.orange;
    if (complaint.status == 'resolved') color = Colors.green;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(complaint.title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(complaint.description),
            const SizedBox(height: 4),
            Text(DateFormat('dd MMM yyyy, hh:mm a').format(complaint.createdAt), style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
          child: Text(complaint.status, style: TextStyle(color: color, fontSize: 12, fontWeight: FontWeight.bold)),
        ),
      ),
    );
  }
}
