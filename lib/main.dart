import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:mini_gnosis/login.dart';

import 'config.dart';

var log = Logger();

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: Config.of(context).name,
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
      ),
      home: LoginScreen(),
    );
  }
}

class Home extends StatefulWidget {
  Home({Key key}) : super(key: key);

  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  List<String> _entries = ['First', 'Second', 'Third'];

  void _addEntry() {
    setState(() {
      _entries.add(DateTime.now().toString());
    });
  }

  void _searched(String search) {
    log.i(search);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: new TextField(
          // throws assertion: "RenderBox was not laid out: RenderEditable#2f35b NEEDS-LAYOUT NEEDS-PAINT"
          //autofocus: true,
          decoration: new InputDecoration(hintText: " search ..."),
          onSubmitted: _searched,
        ),
        leading: Icon(Icons.menu),
      ),
      body: Scrollbar(
        child: ListView(
          children: _entries
              .map((name) => Card(
                    child: ListTile(
                        subtitle: Text("my little pony"),
                        title: Text(name),
                        trailing: IconButton(
                          icon: Icon(Icons.delete),
                          onPressed: () => setState(() {
                            _entries.remove(name);
                          }),
                        )),
                  ))
              .toList(),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addEntry,
        tooltip: 'Add Entry',
        child: Icon(Icons.add),
      ), // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
