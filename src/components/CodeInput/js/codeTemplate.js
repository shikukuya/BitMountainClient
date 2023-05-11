/**
 *
 * by littlefean
 */

//
const cppTemplate = `
#include <iostream>

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

int main() {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("%d\\n", a + b);
    return 0;
}
`;
const pythonTemplate = `
a, b = map(int, input().split())
print(a + b)
`;

const jsTemplate = `
const readline = require('readline');
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
