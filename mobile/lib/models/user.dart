class User {
  final int id;
  final String username;
  final String email;
  final String role;
  final String fullName;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.role,
    required this.fullName,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      username: json['username'],
      email: json['email'] ?? '',
      role: json['role'] ?? 'student',
      fullName: json['full_name'] ?? '',
    );
  }
}
