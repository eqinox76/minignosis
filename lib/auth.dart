import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class Auth extends ChangeNotifier {
  Auth() {
    FirebaseAuth.instance.authStateChanges().listen((User? user) {
      this.notify(user);
    });
  }
  User? _user;

  void notify(User? user) {
    this._user = user;
    notifyListeners();
  }

  void logout() {
    FirebaseAuth.instance.signOut();
  }

  void login() {
    GoogleAuthProvider googleProvider = GoogleAuthProvider();

    // googleProvider
    //     .addScope('https://www.googleapis.com/auth/contacts.readonly');
    googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    googleProvider.setCustomParameters({'login_hint': 'user@gmail.com'});
    FirebaseAuth.instance.signInWithPopup(googleProvider);
  }

  String name() {
    return this._user?.displayName ?? "anonym";
  }

  String? photoURL() {
    return this._user?.photoURL;
  }
}

Widget buildUserActionButton(Auth auth) {
  if (auth.photoURL() != null) {
    return IconButton(
      icon: CircleAvatar(
        backgroundImage: NetworkImage(auth.photoURL()!),
      ),
      onPressed: auth.logout,
      tooltip: "Logout",
    );
  }
  return IconButton(
    icon: CircleAvatar(),
    onPressed: auth.login,
    tooltip: "Login",
  );
}
