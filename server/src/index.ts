import 'module-alias/register';
import App from "./app";
import { SERVER_PORT } from "./constants";
import "./services";

App.listen(SERVER_PORT)
