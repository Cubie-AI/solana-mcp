# Resources

These are all the available resources that can be retrieved using the MCP Server.

## Token

### token://{mint}/supply

Fetch total token supply for the provided mint address.

Example response:

```
{
  contents: [
    {
      uri: 'token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/supply',
      text: 'Token supply for 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
      supply: {
        amount: '999727005988681',
        decimals: 6,
        uiAmount: 999727005.988681,
        uiAmountString: '999727005.988681'
      }
    }
  ]
}
```

### token://{mint}/program

Returns whether the owner of the mint address is the Token program or the Token2022 program

Example Response:

```
{
  contents: [
    {
      uri: 'token://2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo/program',
      text: 'Token program for 2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
      program: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
    }
  ]
}
```

### token://{mint}/holders

Returns all the holders of the token with a balance greater than 0

Example Response:

```
{
  contents: [
    {
      uri: 'token://2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump/holders',
      text: 'Token holders for 2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
      mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
      holders: [
        {
          owner: 'HAMpE3xwU5bsRfKzzL45sgoYpCKcgtMeMmTKfrbs1oRv',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '199043148426',
          decimals: 6,
          uiAmount: 199043.148426,
          uiAmountString: '199043.148426'
        },
        {
          owner: '2Tmgd28h22G5xXUCRdeJSg1Kf3HYEV8Vz1vuHC6j6AWW',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '1',
          decimals: 6,
          uiAmount: 0.000001,
          uiAmountString: '0.000001'
        },
        {
          owner: 'BVi3YPRCFQeHd6AvgEr6C4gq2HZK6Gnw7i3fA75PnkZw',
          mint: '2MH8ga3TuLvuvX2GUtVRS2BS8B9ujZo3bj5QeAkMpump',
          amount: '1098877766667',
          decimals: 6,
          uiAmount: 1098877.766667,
          uiAmountString: '1098877.766667'
        },
        ... 1400 more items
      ]
    }
  ]
}
```

## Address

### address://{address}/balance

Returns the current Solana holdings for the given address.

Example Response:

```
{
  contents: [
    {
      uri: 'address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/balance',
      text: 'Wallet balance for 5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7',
      balance: {
        amount: 9488023810,
        amountString: '9488023810',
        uiAmount: 9.48802381,
        uiAmountString: '9.48802381'
      }
    }
  ]
}
```

### address://{address}/signatures

Returns the last 1000 signatures for a given address

Example Response:

```
{
  contents: [
    {
      uri: 'address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/signatures',
      text: 'Signatures for 5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7',
      signatures: [
        {
          blockTime: 1745387748,
          confirmationStatus: 'finalized',
          err: null,
          memo: null,
          signature: '2rX2HgNAadujCL3T5J8tsPetgvvuxktAL9pXfmBDguVKVVnLpLXQbMfBfKmz5zAaJ5qe9362pSt2x8L6gE7JG2Nu',
          slot: 335310532
        },
        {
          blockTime: 1745351496,
          confirmationStatus: 'finalized',
          err: null,
          memo: null,
          signature: '5J6e9DfEwVvqxVTvCSxYgLyY99yJB8q76Jm9M964axeEUt91jKuTAesYZXdEQLVJkdcaZ2a5xt4fuHWYdht7r5Rc',
          slot: 335219216
        },
        ... 900 more items
      ]
    }
  ]
}
```

### address://{address}/tokens

Returns all of the token holdings (both Token & Token2022) for a given address

Example Response:

```
{
  contents: [
    {
      uri: 'address://5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7/tokens',
      text: 'Tokens for 5e2qRc1DNEXmyxP8qwPwJhRWjef7usLyi7v5xjqLr5G7',
      tokens: [
        {
          mint: 'EXi2ghUArp8Y97vvC4N9ukREnARi74uouJ31URhWpump',
          amount: '1000000000000',
          decimals: 6,
          uiAmount: 1000000,
          uiAmountString: '1000000'
        },
        {
          mint: '3YkSrEofKq9b6Tkfn66yKLyhGBAicV95keUGxWajpump',
          amount: '1000000000000',
          decimals: 6,
          uiAmount: 1000000,
          uiAmountString: '1000000'
        },
        {
          mint: '4JYWAQKn2QZQEhCu1Tg4HXBT85YGQRuVrsHgfizBpump',
          amount: '1919191919190',
          decimals: 6,
          uiAmount: 1919191.91919,
          uiAmountString: '1919191.91919'
        },
        {
          mint: 'BarronFfQSyG67twTozrEPV8TKdijkuyodVmQ5ahDb1A',
          amount: '150000000000000000',
          decimals: 9,
          uiAmount: 150000000,
          uiAmountString: '150000000'
        },
        {
          mint: '5uwfx2Uf42ce7jBRPXNhjtpUEJvdxUvY6PbmGNcw9J6M',
          amount: '11400000000000',
          decimals: 6,
          uiAmount: 11400000,
          uiAmountString: '11400000'
        },
        {
          mint: '71ovwWtASxvXnCvXabh48t9YWcYksSgSN7mauVnLWCrB',
          amount: '100000000',
          decimals: 6,
          uiAmount: 100,
          uiAmountString: '100'
        },
        ... 1491 more items
      ]
    }
  ]
}
```
