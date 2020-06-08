class Mail {
  static encodeEmail(to, from, subject, message) {
    var str = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      "MIME-Version: 1.0\n",
      "Content-Transfer-Encoding: 7bit\n",
      "to: ",
      to,
      "\n",
      "from: ",
      from,
      "\n",
      "subject: ",
      subject,
      "\n\n",
      message,
    ].join("");

    var encodedMail = new Buffer(str)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
    return encodedMail;
  }

  static parseMail(email) {
    return email;
  }
}
module.exports = Mail;
