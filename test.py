import jwt
import time
from datetime import datetime, timedelta, timezone

token = jwt.encode({
    "user_id": "001dee2b-39d6-49c1-90f8-6cd0b60e9fb0",
    "exp":  datetime.now(timezone.utc) + timedelta(hours=1),
    "email": "karthikeyaveruturi2005@gmail.com"
}, "secret", algorithm="HS256")


expiration_period = timedelta(hours=1)
current_time = datetime.now()
expires_at = int(time.mktime(
    (current_time + expiration_period).timetuple()))

print(expires_at)