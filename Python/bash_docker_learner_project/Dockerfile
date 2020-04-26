FROM python:3-alpine

RUN pip3 install flask flask_cors
ENV SERVER_PORT=3000

ADD flaky_flask.py /

CMD python /flaky_flask.py