import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:logger/logger.dart';
import 'package:mini_gnosis/config.dart';

import 'main.dart';

// https://github.com/FirebaseExtended/flutterfire/tree/master/packages/firebase_auth/firebase_auth
// https://medium.com/flutter-community/flutter-implementing-google-sign-in-71888bca24ed
final GoogleSignIn _googleSignIn = GoogleSignIn(
  clientId:
      '421510786679-puvuab9081e0l87cbobmfcakmj1nrkut.apps.googleusercontent.com',
);
final FirebaseAuth _auth = FirebaseAuth.instance;
var log = Logger();

Future<String> signInWithGoogle(BuildContext context) async {

  if (Config.of(context).skipLogin) {
    log.w('DEVELOPMENT BUILD skipping login.');
    return 'devlopmentuser';
  }

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
              signInWithGoogle(context).then((name) {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => Home()),
                );
              }).catchError((err) {
                log.e('could not log in:', err);
                Scaffold.of(context).showSnackBar(SnackBar(
                  backgroundColor: Colors.amber,
                  content: Text(
                    'Could not log in:' + err.toString(),
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
