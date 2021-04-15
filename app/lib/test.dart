import 'dart:convert';
import 'package:web_socket_channel/io.dart';

void main() async {
  final client =
      IOWebSocketChannel.connect(Uri.parse('ws://192.168.1.63:3000'));
  var data = {"room": "darwin", "msg": "hi sanke"};
  var jsonString = json.encode(data);

  client.sink.add(json.encode({
    "join": "darwin",
  }));
  client.sink.add(jsonString);
  // client.sink.add(json.encode({"msg": "hahah"}));
  client.stream.listen((event) {
    print(event);
  });
}
