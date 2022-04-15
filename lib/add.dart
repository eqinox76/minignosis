import 'dart:html';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';

import 'dart:developer' as developer;

import 'auth.dart';

class AddForm extends StatefulWidget {
  @override
  AddFormState createState() {
    return AddFormState();
  }
}

class AddFormState extends State<AddForm> {
  final _formKey = GlobalKey<FormState>();
  String? _url;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("new entry"),
        actions: <Widget>[
          Consumer<Auth>(builder: (context, auth, child) {
            return buildUserActionButton(auth);
          }),
        ],
      ),
      body: Form(
        key: _formKey,
        child: Column(
          children: <Widget>[
            TextFormField(
              decoration: const InputDecoration(
                labelText: 'URL',
              ),
              onSaved: (String? value) {
                _url = value;
              },
              validator: (value) {
                if (value == null || value.length < 5) {
                  return "too short";
                }
                return null;
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (_formKey.currentState!.validate()) {
            developer.log("url $_url");
            // FirebaseFirestore.instance.collection('entries').add({
            //   'url': _url,
            // });

            Navigator.pop(context);
          } else {
            ScaffoldMessenger.of(context)
                .showSnackBar(SnackBar(content: Text('Invalid Entries')));
          }
        },
        tooltip: 'Save',
        child: Icon(Icons.save),
      ),
    );
  }
}

// const result = new Map<string, any>([
//   ["url", this.url],
//   ["name", this.name],
//   ["imageUrl", this.imageUrl],
//   ["description", this.description],
//   ["tags", this.tags],
//   // search shall not be modified by the frontend
//   ["added", this.added === undefined ? firestore.FieldValue.serverTimestamp() : this.added]
// ]);
// return Array.from(result).reduce((obj: any, [key, value]) => {
//   // need to filter undefined values for the firestore api
//   if (value !== undefined) {
//     obj[key] = value;
//   }
//   return obj;
// }, {});
