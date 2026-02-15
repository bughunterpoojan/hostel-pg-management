class Bed {
  final int id;
  final int room;
  final String roomNumber;
  final String identifier;
  final bool isOccupied;
  final String roomType;
  final int floorNumber;
  final String hostelName;

  Bed({
    required this.id,
    required this.room,
    required this.roomNumber,
    required this.identifier,
    required this.isOccupied,
    required this.roomType,
    required this.floorNumber,
    required this.hostelName,
  });

  factory Bed.fromJson(Map<String, dynamic> json) {
    return Bed(
      id: json['id'],
      room: json['room'],
      roomNumber: json['room_number'],
      identifier: json['identifier'],
      isOccupied: json['is_occupied'],
      roomType: json['room_type'] ?? 'N/A',
      floorNumber: json['floor_number'] ?? 0,
      hostelName: json['hostel_name'] ?? 'N/A',
    );
  }
}

class Rent {
  final int id;
  final double amount;
  final DateTime month;
  final DateTime dueDate;
  final double lateFee;
  final String status;

  Rent({
    required this.id,
    required this.amount,
    required this.month,
    required this.dueDate,
    required this.lateFee,
    required this.status,
  });

  factory Rent.fromJson(Map<String, dynamic> json) {
    return Rent(
      id: json['id'],
      amount: double.parse(json['amount'].toString()),
      month: DateTime.parse(json['month']),
      dueDate: DateTime.parse(json['due_date']),
      lateFee: double.parse(json['late_fee'].toString()),
      status: json['status'],
    );
  }
}

class Complaint {
  final int id;
  final String title;
  final String description;
  final String status;
  final DateTime createdAt;

  Complaint({
    required this.id,
    required this.title,
    required this.description,
    required this.status,
    required this.createdAt,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      status: json['status'],
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class LeaveApplication {
  final int id;
  final DateTime startDate;
  final DateTime endDate;
  final String reason;
  final String status;
  final DateTime appliedAt;

  LeaveApplication({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.reason,
    required this.status,
    required this.appliedAt,
  });

  factory LeaveApplication.fromJson(Map<String, dynamic> json) {
    return LeaveApplication(
      id: json['id'],
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
      reason: json['reason'],
      status: json['status'],
      appliedAt: DateTime.parse(json['applied_at']),
    );
  }
}

class Document {
  final int id;
  final String docType;
  final String fileUrl;
  final String status;
  final DateTime uploadedAt;

  Document({
    required this.id,
    required this.docType,
    required this.fileUrl,
    required this.status,
    required this.uploadedAt,
  });

  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'],
      docType: json['doc_type'],
      fileUrl: json['file'],
      status: json['status'],
      uploadedAt: DateTime.parse(json['uploaded_at']),
    );
  }

  String get typeDisplay {
    switch (docType) {
      case 'aadhar': return 'Aadhar Card';
      case 'college_id': return 'College ID';
      default: return 'Other';
    }
  }
}
