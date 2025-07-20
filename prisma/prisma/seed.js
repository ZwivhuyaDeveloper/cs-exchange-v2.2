"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// seed.ts
var client_1 = require("@prisma/client");
var constants_1 = require("../src/constants");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var chains, _i, chains_1, chain, getTradingViewSymbol, _a, MAINNET_TOKENS_1, token, _b, POLYGON_TOKENS_1, token, _c, TRADINGVIEW_TOKEN_LISTS_1, list, tokenList, _d, _e, token, dbToken;
        var _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    chains = [
                        {
                            chainId: 1,
                            name: 'Ethereum Mainnet',
                            nativeToken: 'ETH',
                            rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
                            explorerUrl: 'https://etherscan.io',
                        },
                        {
                            chainId: 137,
                            name: 'Polygon',
                            nativeToken: 'MATIC',
                            rpcUrl: 'https://polygon-rpc.com',
                            explorerUrl: 'https://polygonscan.com',
                        },
                        // Add more chains as needed
                    ];
                    _i = 0, chains_1 = chains;
                    _m.label = 1;
                case 1:
                    if (!(_i < chains_1.length)) return [3 /*break*/, 4];
                    chain = chains_1[_i];
                    return [4 /*yield*/, prisma.chain.upsert({
                            where: { chainId: chain.chainId },
                            update: chain,
                            create: chain,
                        })];
                case 2:
                    _m.sent();
                    _m.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    getTradingViewSymbol = function (symbol) {
                        return constants_1.TOKEN_TO_TRADINGVIEW[symbol.toLowerCase()] || symbol;
                    };
                    _a = 0, MAINNET_TOKENS_1 = constants_1.MAINNET_TOKENS;
                    _m.label = 5;
                case 5:
                    if (!(_a < MAINNET_TOKENS_1.length)) return [3 /*break*/, 8];
                    token = MAINNET_TOKENS_1[_a];
                    return [4 /*yield*/, prisma.token.upsert({
                            where: {
                                chainId_address: {
                                    chainId: 1,
                                    address: ((_f = token.address) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || '',
                                },
                            },
                            update: __assign(__assign({}, token), { address: ((_g = token.address) === null || _g === void 0 ? void 0 : _g.toLowerCase()) || '', logoURL: token.logoURL, coingeckoId: constants_1.COINGECKO_IDS[token.symbol.toLowerCase()] || null, tradingViewSymbol: getTradingViewSymbol(token.symbol), type: token.type ? token.type.toUpperCase() : 'CRYPTO', exchange: token.exchange || null }),
                            create: __assign(__assign({}, token), { chainId: 1, address: ((_h = token.address) === null || _h === void 0 ? void 0 : _h.toLowerCase()) || '', logoURL: token.logoURL, coingeckoId: constants_1.COINGECKO_IDS[token.symbol.toLowerCase()] || null, tradingViewSymbol: getTradingViewSymbol(token.symbol), type: token.type ? token.type.toUpperCase() : 'CRYPTO', exchange: token.exchange || null }),
                        })];
                case 6:
                    _m.sent();
                    _m.label = 7;
                case 7:
                    _a++;
                    return [3 /*break*/, 5];
                case 8:
                    _b = 0, POLYGON_TOKENS_1 = constants_1.POLYGON_TOKENS;
                    _m.label = 9;
                case 9:
                    if (!(_b < POLYGON_TOKENS_1.length)) return [3 /*break*/, 12];
                    token = POLYGON_TOKENS_1[_b];
                    return [4 /*yield*/, prisma.token.upsert({
                            where: {
                                chainId_address: {
                                    chainId: 137,
                                    address: ((_j = token.address) === null || _j === void 0 ? void 0 : _j.toLowerCase()) || '',
                                },
                            },
                            update: __assign(__assign({}, token), { address: ((_k = token.address) === null || _k === void 0 ? void 0 : _k.toLowerCase()) || '', logoURL: token.logoURL, coingeckoId: constants_1.COINGECKO_IDS[token.symbol.toLowerCase()] || null, tradingViewSymbol: getTradingViewSymbol(token.symbol), type: token.type ? token.type.toUpperCase() : 'CRYPTO', exchange: token.exchange || null }),
                            create: __assign(__assign({}, token), { chainId: 137, address: ((_l = token.address) === null || _l === void 0 ? void 0 : _l.toLowerCase()) || '', logoURL: token.logoURL, coingeckoId: constants_1.COINGECKO_IDS[token.symbol.toLowerCase()] || null, tradingViewSymbol: getTradingViewSymbol(token.symbol), type: token.type ? token.type.toUpperCase() : 'CRYPTO', exchange: token.exchange || null }),
                        })];
                case 10:
                    _m.sent();
                    _m.label = 11;
                case 11:
                    _b++;
                    return [3 /*break*/, 9];
                case 12:
                    _c = 0, TRADINGVIEW_TOKEN_LISTS_1 = constants_1.TRADINGVIEW_TOKEN_LISTS;
                    _m.label = 13;
                case 13:
                    if (!(_c < TRADINGVIEW_TOKEN_LISTS_1.length)) return [3 /*break*/, 20];
                    list = TRADINGVIEW_TOKEN_LISTS_1[_c];
                    return [4 /*yield*/, prisma.tokenList.upsert({
                            where: { listId: list.id },
                            update: {
                                name: list.name,
                                description: list.description,
                                isDefault: !!list.isDefault,
                            },
                            create: {
                                listId: list.id,
                                name: list.name,
                                description: list.description,
                                isDefault: !!list.isDefault,
                            },
                        })];
                case 14:
                    tokenList = _m.sent();
                    _d = 0, _e = list.tokens;
                    _m.label = 15;
                case 15:
                    if (!(_d < _e.length)) return [3 /*break*/, 19];
                    token = _e[_d];
                    return [4 /*yield*/, prisma.token.findFirst({
                            where: {
                                symbol: token.symbol,
                                chainId: 1,
                            },
                        })];
                case 16:
                    dbToken = _m.sent();
                    if (!dbToken) return [3 /*break*/, 18];
                    return [4 /*yield*/, prisma.token.update({
                            where: { id: dbToken.id },
                            data: {
                                TokenList: {
                                    connect: { id: tokenList.id },
                                },
                            },
                        })];
                case 17:
                    _m.sent();
                    _m.label = 18;
                case 18:
                    _d++;
                    return [3 /*break*/, 15];
                case 19:
                    _c++;
                    return [3 /*break*/, 13];
                case 20:
                    console.log('Seed complete!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
