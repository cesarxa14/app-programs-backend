"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
const index_1 = require("./api/index");
// USAMOS CORS
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
//app.use(bodyParser.json());
app.use(body_parser_1.default.json({ limit: '10mb' }));
//Agregamos handler para recibir json
app.use(express_1.default.json());
//Inicializar el router de express con todos los endpoint
(0, index_1.indexRoutes)(app);
const initilizeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // LEVANTAR EL SERVIDOR 
        app.listen(PORT, () => {
            console.log(`Server on port ${PORT}`);
        });
    }
    catch (err) {
        console.log('Error -> Initilize app -> ', err);
    }
});
initilizeApp();
