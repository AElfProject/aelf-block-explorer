/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:19:21
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:12:07
 * @Description: CollectionDetails
 */
export default function CollectionDetails({ params }: { params: ChainId & CollectionSymbol }) {
  console.log(params);
  return (
    <div>
      CollectionDetails, my chainId is {params.chain}, my collectionSymbol is {params.collectionSymbol}
    </div>
  );
}
