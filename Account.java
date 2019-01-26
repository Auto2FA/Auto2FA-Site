public class Account {
    private String email;
    private String secret;

    public Account() {
	this.email = NULL;
	this.secret = NULL;
    }

    private void generateSecret() {
	this.secret = "secret";
    }

    public void setEmail(String email) {
	this.email = email;
    }
    
    public String getEmail() {
	return this.email;
    }

    public Strubg getSecret() {
	if (!this.secret)
	    generateSecret();
	return this.secret;
    }
}
