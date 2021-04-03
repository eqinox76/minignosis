import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_linkify/flutter_linkify.dart';
import 'package:url_launcher/url_launcher.dart';

class Overview extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    CollectionReference entries =
        FirebaseFirestore.instance.collection('entries');

    return StreamBuilder<QuerySnapshot>(
      stream: entries.limit(10).snapshots(),
      builder: (BuildContext context, AsyncSnapshot<QuerySnapshot> snapshot) {
        if (snapshot.hasError) {
          return Text('Something went wrong ${snapshot.error}');
        }

        if (snapshot.connectionState == ConnectionState.waiting) {
          return Text("Loading");
        }

        return new Flexible(
          child: new ListView(
            children: snapshot.data?.docs.map((DocumentSnapshot document) {
                  return new ListTile(
                      title: new Text(document.data()?['name']),
                      subtitle: Linkify(
                        onOpen: (link) async {
                          if (await canLaunch(link.url)) {
                            await launch(link.url);
                          } else {
                            throw 'Could not launch $link';
                          }
                        },
                        text: document.data()?['url'],
                      )
                      // subtitle: new Text(document.data()?['url']),
                      );
                }).toList() ??
                [Text('Empty')],
          ),
        );
      },
    );
  }
}
