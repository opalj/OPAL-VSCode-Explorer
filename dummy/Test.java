class Test {
    public static void main(String args[]) {
        System.out.println("test1123");
        Test test = new Test();
        test.example();
    }

    public void example() {
        outer:
        for (int i = 2; i < 1000; i++) {
            for (int j = 2; j < i; j++) {
                if (i % j == 0)
                    continue outer;
            }
            System.out.println (i);
        }
    }
}