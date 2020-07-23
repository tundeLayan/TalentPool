exports.message = async (url) => {
  const html = `<table width="100%" max-width="500px"style="padding: 0 40px 0 40px; background-color:#ffffff; margin: 100px auto;">
  <tr>
    <td align="center" style="background-color:#ffffff; margin: 0 50px 0 50px;">
      <a><img src="https://res.cloudinary.com/lolamedina/image/upload/v1593451396/talentpool_header_logo_hyd9sg.svg" alt="Logo" width="120" height="100" style="display: block;"></a>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 0 50px 0 50px;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%"
        style="background-color:#ffffff; padding: 0 0 0 20px; margin: 5px auto;">
        <tr>
          <td align="center" style="font-family:sans-serif; font-size: 28px; color: #050505;">
            <p>Hey there,</p>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="color: #153643; font-family: sans-serif; font-size: 16px; line-height: 20px;">
            <p>Welcome to TalentPool.</p><p>Kindly click on the link to continue</p>
          </td>
        </tr>
        <tr>
          <td align="center" style="text-align: center;">
            <a style="width:250px; display:inline-block; text-decoration: none; font-size: 18px; text-align:center;
      background-color:#55acee; border-radius:2px; color:white; height:32px; cursor: pointer; margin: 30px auto; padding-top:9px;"
              href=${url}>
              Get started
            </a>
          </td>
        </tr>
        <tr>
          <td align="center"
            style="color: #153643; font-family:sans-serif; font-size: 16px; line-height: 20px;">
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 30px 30px 30px 30px; margin: 100px;">
      TalentPool,&copy; 2020<br />
    </td>
  </tr>
</table>
  `;
  return html;
};
