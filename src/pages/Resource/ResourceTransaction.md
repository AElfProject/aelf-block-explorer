# 资源币SDK初始化与交易

## 使用投票合约初始化账户

```JavaScript
var aelf = new Aelf(new Aelf.providers.HttpProvider('http://localhost:5000/chain'));
var wallet = Aelf.wallet.getWalletByPrivateKey('112768a614002f2f30e13fd08e3e0adb5e0787205978845d131be8cd1402fc90');
var tokenContract = aelf.chain.contractAt(‘ELF_hQZE5kPUVH8BtVMvKfLVMYeNRYE1xB2RzQVn1E5j5zwb9t’, wallet);
```

## 给资源币controlor 与 账户 初始化elf币

```JavaScript
tokenContract.InitialBalance(‘ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH’, 10000000)
tokenContract.InitialBalance(‘ELF_2MAwuUVHjRizZRJytbvSn7ZhZY1zud9KNkpovPBhzsYECqR’, 10000000)
tokenContract.InitialBalance(‘ELF_4Ne3ytkQiFHkoaUpSp2Gsnb3GQMGdyS4u2ZJ6xjgkaJwpZX’, 10000000)
```

## 部署资源合约

```C#
export AELF_CLI_ENDPOINT=http://localhost:5000
dotnet AElf.CLI2.dll deploy 1 ../../../../**AElf.Contracts.Resource**/bin/Debug/netstandard2.0/AElf.Contracts.Resource.dll -account=ELF_4rmETtbgxTqod2P7BLM3pmvtE8ixgFrUP7fwZWqQYz1CFHt -p 123456

```

## 初始化资源合约

```C#
dotnet AElf.CLI2.dll  send ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob Initialize ‘[“ELF_4Qna4KWEr9XyxewGNHku1gwUvqtfsARSHcwjd3WXBpLw9Yx”,”ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH”,”ELF_6WZNJgU5MHWsvzZmPpC7cW6g3qciniQhDKRLCvbQcTCcVFH”]’ —account ELF_4rmETtbgxTqod2P7BLM3pmvtE8ixgFrUP7fwZWqQYz1CFHt  -p 123456
```
参数 ： token合约地址，用户地址 ， controlor 地址

## 初始化资源币

```C#
dotnet AElf.CLI2.dll send ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob IssueResource ‘[“CPU”,100000]’ —account ELF_4rmETtbgxTqod2P7BLM3pmvtE8ixgFrUP7fwZWqQYz1CFHt -p 123456
```

也可以通过  合约方法进行初始化

### 合约方法

```javascript
var aelf = new Aelf(new Aelf.providers.HttpProvider(“http://localhost:5000/chain”));
var wallet = Aelf.wallet.getWalletByPrivateKey('60755aaad4733ead9dd20d9b88811a49d1bb2b7520e829e89d44a060159b32eb');
var ResourceContract = aelf.chain.contractAt(‘ELF_47dpXA3aEuDj9yeq9Et2E4zjPrSs4uQpzdFkYuBZEEQmob’, wallet);
```

购买和issueResource都可以通过这种方式进行
