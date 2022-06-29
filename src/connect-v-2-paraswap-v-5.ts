import { Address, BigInt, DataSourceContext } from "@graphprotocol/graph-ts";
import {
  ConnectV2ParaswapV5,
  SwapCall,
} from "../generated/ConnectV2ParaswapV5/ConnectV2ParaswapV5";
import { Input, SwapData, Event } from "../generated/schema";

export function handleSwap(call: SwapCall): void {
  let id = call.transaction.hash.toHexString();
  let swapData = createOrLoadSwapData(id);
  let inputs = createOrLoadInput(id);
  let events = createOrLoadEvent(id);

  inputs.buyToken = call.inputs.buyAddr;
  inputs.sellToken = call.inputs.sellAddr;
  inputs.callData = call.inputs.callData;
  inputs.sellAmt = call.inputs.sellAmt;
  inputs.unitAmt = call.inputs.unitAmt;
  inputs.setId = call.inputs.setId;

  events.eventName = call.outputs._eventName;
  events.eventParams = call.outputs._eventParam;

  swapData.txnFrom = call.transaction.from;
  swapData.callFrom = call.from;
  swapData.inputs = inputs.id;
  swapData.events = events.id;


  //   let context = new DataSourceContext();
  //   context.setString("dsa", event.params.account.toHexString());
  //   InstaAccountABI.createWithContext(event.params.account, context);

  //   let contract = InstaIndex.bind(event.address);
  //   let instaAccount = InstaAccount.bind(event.params.account);
  //   let instaList = InstaList.bind(contract.list());
  //   let accountId = instaList.accountID(event.params.account);

  //   let dsa = createOrLoadSwapData(event.params.account.toHexString());

  //   dsa.creator = event.params.owner;
  //   dsa.address = event.params.account;
  //   dsa.version = instaAccount.version();
  //   dsa.accountID = accountId;

    swapData.save();
    inputs.save();
    events.save();
}

export function createOrLoadSwapData(id: string): SwapData {
  let dsa = SwapData.load(id);
  if (dsa == null) {
    dsa = new SwapData(id);
  }
  return dsa;
}

export function createOrLoadInput(id: string): Input {
  let input = Input.load(id);
  if (input == null) {
    input = new Input(id);
  }
  return input;
}

export function createOrLoadEvent(id: string): Event {
  let _event = Event.load(id);
  if (_event == null) {
    _event = new Event(id);
  }
  return _event;
}
