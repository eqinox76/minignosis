import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/widgets.dart';

class Auth extends ChangeNotifier {
  Auth() {
    FirebaseAuth.instance.authStateChanges().listen((User? user) {
      this.login(user);
    });
    if (FirebaseAuth.instance.currentUser == null) {
      GoogleAuthProvider googleProvider = GoogleAuthProvider();

      // googleProvider
      //     .addScope('https://www.googleapis.com/auth/contacts.readonly');
      googleProvider.setCustomParameters({'login_hint': 'user@example.com'});
      FirebaseAuth.instance.signInWithPopup(googleProvider);
    }
  }
  User? _user;

  void login(User? user) {
    this._user = user;
    notifyListeners();
  }

  String name() {
    return this._user?.displayName ?? "anonym";
  }
}
