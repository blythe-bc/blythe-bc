

import win32com.client as win32


def send_mail(to, subject, content, df):
    # email에 적용되는 스타일은 각자 취향에 맞게 변경 가능 합니다.
    style = """ .t2{font-size:10pt; font-family:"맑은 고딕"}
                  .t3{font-size:11pt; font-family:"맑은 고딕"}
                  .dataframe  {font-size: 11pt; font-family: Arial; border: 1px solid; border-color:black; border-collapse: collapse;text-align:center;}
                  .dataframe th {padding: 5px; background-color:rgb(204,217,255); border-color:black; border-collapse: collapse;}
                  .dataframe  td {padding: 5px; border-color:black; border-collapse: collapse;}"""
    # temp = df.to_html(index=False, justify='center')
    # 대괄호에 들어가는 건 .format() 에 순서대로 들어가는 변수들의 위치 입니다. style == 0 , content == 1, temp ==2
    content = """
              <html>
                  <head><style> {0} </style></head>
                  <body>
                      <div class="t2"> 
                      안녕하세요. <br><br>
                      이메일 전송 TEST 입니다..<br><br> 
                      {1}<br>
                    </div>""".format(style, content)

    # content = """
    #               <html>
    #                   <head><style> {0} </style></head>
    #                   <body>
    #                       <div class="t2">
    #                       안녕하세요. <br><br>
    #                       이메일 전송 TEST 입니다..<br><br>
    #                       {1}<br>{2}
    #                     </div>""".format(style, content, temp)
    # Outlook Object Model 불러오기
    new_Mail = win32.Dispatch("Outlook.Application").CreateItem(0)
    # 메일 수신자
    new_Mail.To = to
    # 메일 참조
    # new_Mail.CC = "mail-add-for-cc@testadd.com"
    # 메일 제목
    new_Mail.Subject = subject
    # 메일 내용
    new_Mail.HTMLBody = content

    # 첨부파일 추가
    # if atch:
    #     for file in atch:
    #         new_Mail.Attachments.Add(file)
    # 메일 발송
    new_Mail.Send()


# df 이 없으면 안 쓰셔두 됩니다.
# df = 엑셀의 load 및 df 처리한 데이터

# send_mail("byeongcheol.kim@amkor.co.kr","이메일 전송 TEST","",df)
send_mail("byeongcheol.kim@amkor.co.kr", "이메일 전송 TEST", "", '')
