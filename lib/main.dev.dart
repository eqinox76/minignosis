import 'package:flutter/cupertino.dart';

import 'config.dart';
import 'main.dart';


void main() {
  var configuredApp = new Config(
    skipLogin: true,
    name: 'Mini Gnosis Dev',
    child: new MyApp(),
  );

  runApp(configuredApp);
}