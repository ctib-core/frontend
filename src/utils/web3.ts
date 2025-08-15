import controller_abi from "./abi/controller.json";
import gateway_abi from "./abi/gateway.json";

const controller_addr: `0x${string}` = process.env.NEXT_PUBLIC_CONTROLLER_ADDRESS as `0x${string}`;
const gateway_addr: `0x${string}` = process.env.NEXT_PUBLIC_GATEWAY_ADDRESS as `0x${string}`;
const pul_token_addr: `0x${string}` = process.env.NEXT_PUBLIC_PUL_TOKEN_ADDRESS as `0x${string}`;

const core_addr = "0x";
export { controller_addr, gateway_addr, controller_abi, gateway_abi, core_addr, pul_token_addr };
