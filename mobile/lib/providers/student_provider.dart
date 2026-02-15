import 'package:flutter/material.dart';
import '../models/hostel_models.dart';
import '../services/api_service.dart';

class StudentProvider with ChangeNotifier {
  Bed? _currentBed;
  List<Rent> _rents = [];
  List<Complaint> _complaints = [];
  bool _isLoading = false;
  final ApiService _apiService = ApiService();

  List<LeaveApplication> _leaves = [];

  List<Document> _documents = [];

  Bed? get currentBed => _currentBed;
  List<Rent> get rents => _rents;
  List<Complaint> get complaints => _complaints;
  List<LeaveApplication> get leaves => _leaves;
  List<Document> get documents => _documents;
  bool get isLoading => _isLoading;

  Rent? get unpaidRent {
    try {
      return _rents.firstWhere((r) => r.status == 'unpaid');
    } catch (e) {
      return _rents.isNotEmpty ? _rents.first : null;
    }
  }

  Future<void> fetchDashboardData() async {
    _isLoading = true;
    notifyListeners();

    try {
      final responses = await Future.wait([
        _apiService.client.get('activity/profiles/'),
        _apiService.client.get('activity/rents/'),
        _apiService.client.get('activity/complaints/'),
        _apiService.client.get('activity/leaves/'),
        _apiService.client.get('activity/documents/'),
      ]);

      if (responses[0].statusCode == 200) {
        final profileData = responses[0].data[0];
        if (profileData['current_bed_details'] != null) {
          _currentBed = Bed.fromJson(profileData['current_bed_details']);
        }
      }

      if (responses[1].statusCode == 200) {
        _rents = (responses[1].data as List)
            .map((r) => Rent.fromJson(r))
            .toList();
      }

      if (responses[2].statusCode == 200) {
        _complaints = (responses[2].data as List)
            .map((c) => Complaint.fromJson(c))
            .toList();
      }

      if (responses[3].statusCode == 200) {
        _leaves = (responses[3].data as List)
            .map((l) => LeaveApplication.fromJson(l))
            .toList();
      }

      if (responses[4].statusCode == 200) {
        _documents = (responses[4].data as List)
            .map((d) => Document.fromJson(d))
            .toList();
      }
    } catch (e) {
      print('Error fetching dashboard data: $e');
    }

    _isLoading = false;
    notifyListeners();
  }
}
