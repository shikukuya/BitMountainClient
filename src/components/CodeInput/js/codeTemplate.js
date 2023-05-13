/**
 *
 * by littlefean
 */

//
const cppTemplate = `
#include <iostream>
// 以下是C++实现a+b问题的模板代码
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
`;

const javaTemplate = `
import java.util.Scanner;

// 以下是java实现的模板代码，其中Main类不要改

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
        sc.close();
    }
}
`;
const cTemplate = `
#include <stdio.h>

// 以下是C语言实现a+b问题的模板代码

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}
`;
const pythonTemplate = `
# 以下是Python实现A+B问题的模板代码
a, b = map(int, input().split())
print(a + b)
`;

const jsTemplate = `
const readline = require('readline');
// 以下是Nodejs实现A+B问题的代码
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  const [a, b] = line.trim().split(' ').map(Number);
  console.log(a + b);
});

`;

const templates = {
  "c": cTemplate.trim(),
  "cpp": cppTemplate.trim(),
  "java": javaTemplate.trim(),
  "javascript": jsTemplate.trim(),
  "python": pythonTemplate.trim(),
}

export default templates;
