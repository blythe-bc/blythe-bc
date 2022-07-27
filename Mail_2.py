# mdecxhwgatekcebu

import smtplib
from email.mime.text import MIMEText

s = smtplib.SMTP('smtp.gmail.com', 587)
s.starttls()
s.login('Byeongcheol.kim@amkor.co.kr', 'Password')

msg = MIMEText('내용 : 본문내용 테스트입니다.')
msg['Subject'] = '제목 : 메일 보내기 테스트입니다.'
s.sendmail("Byeongcheol.kim@amkor.co.kr", "Byeongcheol.kim@amkor.co.kr", msg.as_string())
s.quit()
