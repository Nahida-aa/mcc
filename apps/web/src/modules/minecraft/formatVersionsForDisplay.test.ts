import { getMcVersions } from '@/modules/minecraft/constants'
import { formatVersionsForDisplay } from '@/modules/minecraft/formatVersionsForDisplay'

console.log(formatVersionsForDisplay(['1.21.11'], getMcVersions('all'))) // ["1.21.11"]
console.log(formatVersionsForDisplay(['1.21.11', '1.21.10'], getMcVersions('all'))) // ["1.21.10-1.21.11"]
console.log(
  formatVersionsForDisplay(['1.21.11', '1.21.10', '1.21.9'], getMcVersions('all')),
) // ["1.21.9-1.21.11"]
console.log(
  formatVersionsForDisplay(['1.21.11', '1.21.10', '1.21.8'], getMcVersions('all')),
) // ["1.21.10-1.21.11", '1.21.8']]
