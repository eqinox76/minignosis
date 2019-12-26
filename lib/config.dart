import 'package:flutter/material.dart';
import 'package:meta/meta.dart';

//https://iirokrankka.com/2018/03/02/separating-build-environments/
class Config extends InheritedWidget {
  Config({
    @required this.skipLogin,
    @required this.name,
    @required Widget child,
  }) : super(child: child);

  final bool skipLogin;
  final String name;

  static Config of(BuildContext context) {
    return context.inheritFromWidgetOfExactType(Config);
  }

  @override
  bool updateShouldNotify(InheritedWidget oldWidget) => false;
}