/**
 * @file formatNumber
 * @author zhouminghui
*/

export default function formatNumber(num) {
    if (num !== undefined || num != null) {
        return num.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
    }
}
