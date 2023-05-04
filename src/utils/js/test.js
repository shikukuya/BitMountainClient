function hashCode(str) {
  let hash = 0;
  const prime = 1000003; // 取一个大一点的质数作为模数
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) % prime;
  }
  return hash;
}

console.log(hashCode("1-5-1512"));
console.log(hashCode("1-6-1512"));
