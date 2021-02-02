/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BytesLike } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { MirrorENSRegistrar } from "../MirrorENSRegistrar";

export class MirrorENSRegistrar__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    rootName_: string,
    rootNode_: BytesLike,
    ensRegistry_: string,
    ensResolver_: string,
    inviteToken_: string,
    overrides?: Overrides
  ): Promise<MirrorENSRegistrar> {
    return super.deploy(
      rootName_,
      rootNode_,
      ensRegistry_,
      ensResolver_,
      inviteToken_,
      overrides || {}
    ) as Promise<MirrorENSRegistrar>;
  }
  getDeployTransaction(
    rootName_: string,
    rootNode_: BytesLike,
    ensRegistry_: string,
    ensResolver_: string,
    inviteToken_: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      rootName_,
      rootNode_,
      ensRegistry_,
      ensResolver_,
      inviteToken_,
      overrides || {}
    );
  }
  attach(address: string): MirrorENSRegistrar {
    return super.attach(address) as MirrorENSRegistrar;
  }
  connect(signer: Signer): MirrorENSRegistrar__factory {
    return super.connect(signer) as MirrorENSRegistrar__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MirrorENSRegistrar {
    return new Contract(address, _abi, signerOrProvider) as MirrorENSRegistrar;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "rootName_",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "rootNode_",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "ensRegistry_",
        type: "address",
      },
      {
        internalType: "address",
        name: "ensResolver_",
        type: "address",
      },
      {
        internalType: "address",
        name: "inviteToken_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "ENSResolverChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "addr",
        type: "address",
      },
    ],
    name: "InviteTokenChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_ens",
        type: "string",
      },
    ],
    name: "RegisteredENS",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "node",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "RootnodeOwnerChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "_ens",
        type: "string",
      },
    ],
    name: "UnregisteredENS",
    type: "event",
  },
  {
    inputs: [],
    name: "ADDR_REVERSE_NODE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "changeRootnodeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ensRegistry",
    outputs: [
      {
        internalType: "contract IENS",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ensResolver",
    outputs: [
      {
        internalType: "contract IENSResolver",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "inviteToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "label_",
        type: "string",
      },
      {
        internalType: "address",
        name: "owner_",
        type: "address",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reverseRegistrar",
    outputs: [
      {
        internalType: "contract IENSReverseRegistrar",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rootName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rootNode",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateENSReverseRegistrar",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101006040523480156200001257600080fd5b506040516200152e3803806200152e833981810160405260a08110156200003857600080fd5b81019080805160405193929190846401000000008211156200005957600080fd5b9083019060208201858111156200006f57600080fd5b82516401000000008111828201881017156200008a57600080fd5b82525081516020918201929091019080838360005b83811015620000b95781810151838201526020016200009f565b50505050905090810190601f168015620000e75780820380516001836020036101000a031916815260200191505b5060409081526020820151908201516060830151608090930151919450925060006200011b6001600160e01b03620001aa16565b600080546001600160a01b0319166001600160a01b0383169081178255604051929350917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908290a35084516200017a906001906020880190620001af565b506080939093526001600160601b0319606093841b811660c05291831b821660a05290911b1660e0525062000251565b335b90565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10620001f257805160ff191683800117855562000222565b8280016001018555821562000222579182015b828111156200022257825182559160200191906001019062000205565b506200023092915062000234565b5090565b620001ac91905b808211156200023057600081556001016200023b565b60805160a05160601c60c05160601c60e05160601c611262620002cc600039806104d3528061056552806108695280610dfb5250806102a952806109d25250806103b752806105065280610ab75280610c3e5280610cdb52508061033452806104965280610d0a5280610da05280610fc352506112626000f3fe608060405234801561001057600080fd5b50600436106100df5760003560e01c8063808698531161008c578063adce1c5f11610066578063adce1c5f146101eb578063f20387df146101f3578063f2fde38b14610270578063faff50a814610296576100df565b806380869853146101b557806386605d96146101bd5780638da5cb5b146101e3576100df565b8063715018a6116100bd578063715018a61461018b5780637cf8a2eb146101935780637d73b231146101ad576100df565b80631e59c529146100e4578063579393781461015f57806360b17c4314610183575b600080fd5b61015d600480360360408110156100fa57600080fd5b81019060208101813564010000000081111561011557600080fd5b82018360208201111561012757600080fd5b8035906020019184600183028401116401000000008311171561014957600080fd5b9193509150356001600160a01b031661029e565b005b6101676109d0565b604080516001600160a01b039092168252519081900360200190f35b61015d6109f4565b61015d610b57565b61019b610c18565b60408051918252519081900360200190f35b610167610c3c565b610167610c60565b61015d600480360360208110156101d357600080fd5b50356001600160a01b0316610c6f565b610167610dea565b610167610df9565b6101fb610e1d565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561023557818101518382015260200161021d565b50505050905090810190601f1680156102625780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61015d6004803603602081101561028657600080fd5b50356001600160a01b0316610eaa565b61019b610fc1565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146103055760405162461bcd60e51b81526004018080602001828103825260328152602001806111ad6032913960400191505060405180910390fd5b60008383604051602001808383808284376040805191909301818103601f1901825280845281516020928301207f000000000000000000000000000000000000000000000000000000000000000083830152818501819052845180830386018152606083018087528151918501919091207f02571be300000000000000000000000000000000000000000000000000000000909152606483018190529451909850939650600095506001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001694506302571be393608480830194509091829003018186803b1580156103fc57600080fd5b505afa158015610410573d6000803e3d6000fd5b505050506040513d602081101561042657600080fd5b50516001600160a01b03161461046d5760405162461bcd60e51b81526004018080602001828103825260288152602001806112056028913960400191505060405180910390fd5b604080517f5ef2c7f00000000000000000000000000000000000000000000000000000000081527f00000000000000000000000000000000000000000000000000000000000000006004820152602481018490526001600160a01b0385811660448301527f00000000000000000000000000000000000000000000000000000000000000008116606483015260006084830181905292517f000000000000000000000000000000000000000000000000000000000000000090911692635ef2c7f09260a4808201939182900301818387803b15801561054b57600080fd5b505af115801561055f573d6000803e3d6000fd5b505050507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d5fa2b0082856040518363ffffffff1660e01b815260040180838152602001826001600160a01b03166001600160a01b0316815260200192505050600060405180830381600087803b1580156105e357600080fd5b505af11580156105f7573d6000803e3d6000fd5b505060408051600280825260608281019093529193509150816020015b61061c611192565b81526020019060019003908161061457905050905061067086868080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610fe592505050565b8160008151811061067d57fe5b6020908102919091018101919091526001805460408051600283851615610100026000190190931692909204601f810185900485028301850190915280825261071e939192918301828280156107145780601f106106e957610100808354040283529160200191610714565b820191906000526020600020905b8154815290600101906020018083116106f757829003601f168201915b5050505050610fe5565b8160018151811061072b57fe5b602002602001018190525060606107868261077a6040518060400160405280600181526020017f2e00000000000000000000000000000000000000000000000000000000000000815250610fe5565b9063ffffffff61100a16565b600254604080517fbffbe61c0000000000000000000000000000000000000000000000000000000081526001600160a01b0389811660048301529151939450600093919092169163bffbe61c916024808301926020929190829003018186803b1580156107f257600080fd5b505afa158015610806573d6000803e3d6000fd5b505050506040513d602081101561081c57600080fd5b5051604080517f7737221300000000000000000000000000000000000000000000000000000000815260048101838152602482019283528551604483015285519394506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016936377372213938693889392606490910190602085019080838360005b838110156108be5781810151838201526020016108a6565b50505050905090810190601f1680156108eb5780820380516001836020036101000a031916815260200191505b509350505050600060405180830381600087803b15801561090b57600080fd5b505af115801561091f573d6000803e3d6000fd5b50505050856001600160a01b03167f9f2a065383b236afdeb6e9b1d77966068499287f92b04c37831f34f565d14401836040518080602001828103825283818151815260200191508051906020019080838360005b8381101561098c578181015183820152602001610974565b50505050905090810190601f1680156109b95780820380516001836020036101000a031916815260200191505b509250505060405180910390a25050505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b6109fc611150565b6000546001600160a01b03908116911614610a5e576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b604080517f02571be30000000000000000000000000000000000000000000000000000000081527f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2600482015290516001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016916302571be3916024808301926020929190829003018186803b158015610afd57600080fd5b505afa158015610b11573d6000803e3d6000fd5b505050506040513d6020811015610b2757600080fd5b50516002805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b03909216919091179055565b610b5f611150565b6000546001600160a01b03908116911614610bc1576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b600080546040516001600160a01b03909116907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a36000805473ffffffffffffffffffffffffffffffffffffffff19169055565b7f91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e281565b7f000000000000000000000000000000000000000000000000000000000000000081565b6002546001600160a01b031681565b610c77611150565b6000546001600160a01b03908116911614610cd9576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635b0fc9c37f0000000000000000000000000000000000000000000000000000000000000000836040518363ffffffff1660e01b815260040180838152602001826001600160a01b03166001600160a01b0316815260200192505050600060405180830381600087803b158015610d7957600080fd5b505af1158015610d8d573d6000803e3d6000fd5b50506040516001600160a01b03841692507f000000000000000000000000000000000000000000000000000000000000000091507f1219ccb7de3c75be86cb7065f05d9d42fb6a5162e02537d1b0d95a890ff4fd9d90600090a350565b6000546001600160a01b031690565b7f000000000000000000000000000000000000000000000000000000000000000081565b60018054604080516020600284861615610100026000190190941693909304601f81018490048402820184019092528181529291830182828015610ea25780601f10610e7757610100808354040283529160200191610ea2565b820191906000526020600020905b815481529060010190602001808311610e8557829003601f168201915b505050505081565b610eb2611150565b6000546001600160a01b03908116911614610f14576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b038116610f595760405162461bcd60e51b81526004018080602001828103825260268152602001806111df6026913960400191505060405180910390fd5b600080546040516001600160a01b03808516939216917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e091a36000805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b7f000000000000000000000000000000000000000000000000000000000000000081565b610fed611192565b506040805180820190915281518152602082810190820152919050565b606081516000141561102b575060408051602081019091526000815261114a565b815183516000199091010260005b83518110156110675783818151811061104e57fe5b6020908102919091010151519190910190600101611039565b5060608167ffffffffffffffff8111801561108157600080fd5b506040519080825280601f01601f1916602001820160405280156110ac576020820181803683370190505b5090506020810160005b8551811015611143576110f8828783815181106110cf57fe5b6020026020010151602001518884815181106110e757fe5b602002602001015160000151611154565b85818151811061110457fe5b60200260200101516000015182019150600186510381101561113b576111338288602001518960000151611154565b865191909101905b6001016110b6565b5090925050505b92915050565b3390565b5b60208110611174578151835260209283019290910190601f1901611155565b905182516020929092036101000a6000190180199091169116179052565b60405180604001604052806000815260200160008152509056fe4d6972726f72454e535265676973747261723a2063616c6c6572206973206e6f742074686520696e7669746520746f6b656e4f776e61626c653a206e6577206f776e657220697320746865207a65726f20616464726573734d6972726f72454e534d616e616765723a206c6162656c20697320616c7265616479206f776e6564a2646970667358221220995a3ad965e1116c481c8aaf4dfbe7da99948c7e6e5b0bf52eab08e7c697f4ac64736f6c63430006080033";
