class User {
  private username: string;
  // or private username: string | undefined;
  constructor(username: string) {
    this.username = username;
  }
}
