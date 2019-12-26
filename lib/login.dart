import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:logger/logger.dart';

import 'main.dart';

// https://github.com/FirebaseExtended/flutterfire/tree/master/packages/firebase_auth/firebase_auth
// https://medium.com/flutter-community/flutter-implementing-google-sign-in-71888bca24ed
final GoogleSignIn _googleSignIn = GoogleSignIn();
final FirebaseAuth _auth = FirebaseAuth.instance;
var log = Logger();

Future<String> signInWithGoogle() async {
  print('starting login');
  final GoogleSignInAccount googleSignInAccount = await _googleSignIn.signIn();
  print('signed in google');
  final GoogleSignInAuthentication googleSignInAuthentication =
      await googleSignInAccount.authentication;

  print('getting credentials');
  final AuthCredential credential = GoogleAuthProvider.getCredential(
    accessToken: googleSignInAuthentication.accessToken,
    idToken: googleSignInAuthentication.idToken,
  );

  print('checking user');
  final AuthResult authResult = await _auth.signInWithCredential(credential);
  final FirebaseUser user = authResult.user;
  print(user);
  assert(!user.isAnonymous);
  assert(await user.getIdToken() != null);

  final FirebaseUser currentUser = await _auth.currentUser();
  assert(user.uid == currentUser.uid);

  log.i('logged in as $user');

  return 'signInWithGoogle succeeded: $user';
}

void signOutGoogle() async {
  await _googleSignIn.signOut();
  log.i('logged out');
}

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Builder(
        builder: (context) => Center(
          child: RaisedButton(
            child: Text('Login'),
            onPressed: () {
              signInWithGoogle().then((name) {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => Home()),
                );
              }).catchError((err) {
                log.e(err);
                Scaffold.of(context).showSnackBar(SnackBar(
                  backgroundColor: Colors.amber,
                  content: Text(
                    err.toString(),
                    style: TextStyle(color: Colors.black),
                  ),
                  duration: Duration(seconds: 30),
                ));
              });
            },
          ),
        ),
      ),
    );
  }
}
