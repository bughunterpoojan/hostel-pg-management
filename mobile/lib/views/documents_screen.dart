import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../providers/student_provider.dart';
import '../models/hostel_models.dart';
import '../services/api_service.dart';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';

class DocumentsScreen extends StatefulWidget {
  const DocumentsScreen({super.key});

  @override
  State<DocumentsScreen> createState() => _DocumentsScreenState();
}

class _DocumentsScreenState extends State<DocumentsScreen> {
  final _apiService = ApiService();
  final _picker = ImagePicker();

  Future<void> _uploadDocument() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image == null) return;

    String? selectedType = 'aadhar';

    await showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          title: const Text('Upload Document'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                value: selectedType,
                decoration: const InputDecoration(labelText: 'Document Type'),
                items: const [
                  DropdownMenuItem(value: 'aadhar', child: Text('Aadhar Card')),
                  DropdownMenuItem(value: 'college_id', child: Text('College ID')),
                  DropdownMenuItem(value: 'other', child: Text('Other')),
                ],
                onChanged: (v) => setDialogState(() => selectedType = v),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
            ElevatedButton(
              onPressed: () async {
                try {
                  FormData formData = FormData.fromMap({
                    'doc_type': selectedType,
                    'file': await MultipartFile.fromFile(image.path, filename: image.name),
                  });

                  await _apiService.client.post('activity/documents/', data: formData);
                  context.read<StudentProvider>().fetchDashboardData();
                  Navigator.pop(context);
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Upload failed')));
                }
              },
              child: const Text('Upload'),
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
      appBar: AppBar(title: const Text('My Documents')),
      body: student.documents.isEmpty
          ? const Center(child: Text('No documents uploaded.'))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: student.documents.length,
              itemBuilder: (context, index) {
                final d = student.documents[index];
                return _buildDocumentCard(d);
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: _uploadDocument,
        child: const Icon(LucideIcons.upload),
      ),
    );
  }

  Widget _buildDocumentCard(Document doc) {
    Color color = Colors.orange;
    if (doc.status == 'approved') color = Colors.green;
    if (doc.status == 'rejected') color = Colors.red;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: const Icon(LucideIcons.fileText, color: Colors.blue),
        title: Text(doc.typeDisplay, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text('Uploaded: ${DateFormat('dd MMM yyyy').format(doc.uploadedAt)}'),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
          child: Text(doc.status.toUpperCase(), style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ),
        onTap: () {
          // Open URL or preview? For now let's just show info
        },
      ),
    );
  }
}
