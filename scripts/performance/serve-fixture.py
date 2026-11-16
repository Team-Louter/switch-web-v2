# 읽기 전용 성능 측정 서버: 운영 데이터와 연결하지 않습니다.
# PERF_DIST에 프로덕션 빌드 디렉터리를 지정합니다. API 지연은 50ms로 고정합니다.
import gzip, json, mimetypes, os, time, re
from pathlib import Path
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
ROOT = Path(os.environ['PERF_DIST'])
PROFILE = dict(userId=42, userName='테스트 작성자', role='LEADER', grade=2, classRoom=1, number=1, majors=[], profileImageUrl='')

def post(i, pinned=False):
    return dict(postId=i, userId=42, userName='테스트 작성자', userProfileImageUrl='', postTitle=f'고정글 {i}' if pinned else f'게시글 {i}', postContent='\n\n'.join((f'### 문단 {n}\n본문 **강조** 와 [링크](https://example.com) 를 포함한 성능 측정 문단입니다.' for n in range(60))), category='NOTICE' if pinned else 'FREE', createdAt='2026-09-30T01:00:00Z', isAnonymous=False, viewers=10, likeCount=0, commentCount=50, isHearted=False, pinned=pinned, files=[])
POSTS = [post(101, True), post(102, True)] + [post(i) for i in range(1, 71)]
COMMENTS = [dict(commentId=i + 1, userId=42, userName='테스트 작성자', userProfileImageUrl='', content=f'측정 댓글 {i + 1}', depth=0, createdAt='2026-09-30T01:00:00Z', isAnonymous=False, deleted=False, replyCount=0) for i in range(50)]

class Handler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def log_message(self, *args):
        pass

    def do_GET(self):
        url = urlparse(self.path)
        path = url.path
        q = parse_qs(url.query)
        status = 200
        if path.startswith('/api/'):
            time.sleep(0.05)
            p = path[4:]
            if p == '/me':
                data = PROFILE
            elif p == '/in-app-notifications/unread-count':
                data = {'unreadCount': 0}
            elif p in ['/schedules', '/members', '/posts/hot']:
                data = []
            elif p == '/me/posts':
                data = {'content': []}
            elif p == '/ranks/me':
                data = {'rank': 1, 'point': 100}
            elif p.startswith('/typing/results/rankings/'):
                data = {'problemType': 'DAILY', 'topRankings': [], 'myRanking': None}
            elif p == '/posts' or p.startswith('/posts/category/'):
                subset = [x for x in POSTS if p == '/posts' or x['category'] == p.split('/')[-1]]
                page = int(q.get('page', [0])[0])
                size = int(q.get('size', [32])[0])
                content = subset[page * size:(page + 1) * size]
                data = dict(content=content, totalPages=(len(subset) + size - 1) // size, totalElements=len(subset), number=page, size=size, empty=not content)
            elif re.fullmatch('/posts/\\d+', p):
                data = next((x for x in POSTS if x['postId'] == int(p.split('/')[-1])))
            elif p.endswith('/comments'):
                data = COMMENTS
            elif p.endswith('/total-reply-count'):
                data = {'commentId': int(p.split('/')[-2]), 'count': 0}
            elif p.endswith('/stats'):
                data = {'viewers': 10, 'likeCount': 0}
            else:
                print('UNKNOWN', p, flush=True)
                data = {}
                status = 404
            body = json.dumps(data, ensure_ascii=False).encode()
            typ = 'application/json'
        else:
            file = (ROOT / path.lstrip('/')).resolve()
            if not file.is_relative_to(ROOT.resolve()):
                self.send_error(403)
                return
            if not file.is_file():
                file = ROOT / 'index.html'
            body = file.read_bytes()
            typ = mimetypes.guess_type(str(file))[0] or 'application/octet-stream'
        compressed = 'gzip' in self.headers.get('Accept-Encoding', '')
        if compressed:
            body = gzip.compress(body)
        self.send_response(status)
        self.send_header('Content-Type', typ)
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store' if path.startswith('/api/') or typ == 'text/html' else 'public, max-age=3600')
        if compressed:
            self.send_header('Content-Encoding', 'gzip')
        self.end_headers()
        self.wfile.write(body)
print('serving', ROOT, flush=True)
ThreadingHTTPServer(('127.0.0.1', 4173), Handler).serve_forever()
