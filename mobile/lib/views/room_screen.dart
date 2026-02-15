import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/student_provider.dart';

class RoomScreen extends StatelessWidget {
  const RoomScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = context.watch<StudentProvider>();
    final bed = student.currentBed;

    return Scaffold(
      appBar: AppBar(title: const Text('My Room Details')),
      body: bed == null
          ? const Center(child: Text('No room allocation found.'))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const Icon(LucideIcons.home, size: 80, color: Colors.blue),
                  const SizedBox(height: 16),
                  Text('Room ${bed.roomNumber}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                  Text(bed.hostelName, style: const TextStyle(color: Colors.grey, fontSize: 16)),
                  const SizedBox(height: 32),
                  _buildDetailTile(LucideIcons.hash, 'Bed Identifier', bed.identifier),
                  _buildDetailTile(LucideIcons.layers, 'Floor Number', 'Floor ${bed.floorNumber}'),
                  _buildDetailTile(LucideIcons.info, 'Room Type', bed.roomType),
                  _buildDetailTile(LucideIcons.checkCircle, 'Status', bed.isOccupied ? 'Occupied' : 'Vacant'),
                  const SizedBox(height: 40),
                  const Text(
                    'Need to change your room or report an issue? Please raise a complaint or contact the warden.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildDetailTile(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: Colors.blue, size: 20),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
              Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
        ],
      ),
    );
  }
}
