/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 16:22:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:11:41
 * @Description: collection item
 */
export default function ItemDetails({ params }: { params: ChainId & CollectionSymbol & ItemSymbol }) {
  return (
    <div>
      ItemDetails, my chainId is {params.chain}, my collectionSymbol is {params.collectionSymbol}, my ItemSymbol is{' '}
      {params.itemSymbol}
    </div>
  );
}
