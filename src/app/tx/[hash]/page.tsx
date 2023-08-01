/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:01:05
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 17:07:09
 * @Description: TransctionDetails
 */

export default function TransctionDetails({ params }: { params: HashParams }) {
  return <div>Transction details, my hash is {params.hash}</div>;
}
