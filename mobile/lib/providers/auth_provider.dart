import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  final _storage = const FlutterSecureStorage();
  final ApiService _apiService = ApiService();

  User? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.client.post(
        'accounts/login/', // Confirm this endpoint
        data: {'username': username, 'password': password},
      );

      if (response.statusCode == 200) {
        final token = response.data['access'];
        await _storage.write(key: 'jwt_token', value: token);
        
        // Fetch user profile after login
        final profileResponse = await _apiService.client.get('accounts/profile/');
        if (profileResponse.statusCode == 200) {
          _user = User.fromJson(profileResponse.data);
          _isLoading = false;
          notifyListeners();
          return true;
        }
      }
    } catch (e) {
      print('Login error: $e');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _apiService.client.post(
        'accounts/register/',
        data: userData..['role'] = 'student',
      );

      if (response.statusCode == 201) {
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      print('Registration error: $e');
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
    _user = null;
    notifyListeners();
  }

  Future<void> tryAutoLogin() async {
    String? token = await _storage.read(key: 'jwt_token');
    if (token != null) {
      try {
        final response = await _apiService.client.get('accounts/profile/');
        if (response.statusCode == 200) {
          _user = User.fromJson(response.data);
          notifyListeners();
        }
      } catch (e) {
        print('Auto-login error: $e');
        await logout();
      }
    }
  }
}
