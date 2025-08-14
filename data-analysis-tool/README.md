# 데이터 분석 웹 툴

네트워크 폴더를 기반으로 하는 강력한 데이터 분석 및 시각화 웹 애플리케이션입니다.

## 🚀 주요 기능

### 📁 파일 관리
- **다양한 파일 형식 지원**: CSV, Excel (xlsx/xls), JSON, TSV, TXT
- **드래그 앤 드롭 업로드**: 간편한 파일 업로드 인터페이스
- **자동 파일 타입 감지**: 확장자에 따른 자동 파싱
- **파일 목록 관리**: 업로드된 파일들의 체계적 관리

### 📊 데이터 처리
- **자동 데이터 타입 추론**: 숫자, 문자열, 날짜, 불린 타입 자동 감지
- **통계 정보 생성**: 각 컬럼별 상세 통계 (평균, 중앙값, 표준편차 등)
- **데이터 미리보기**: 업로드된 데이터의 즉시 확인
- **빈도 분석**: 카테고리형 데이터의 빈도 분석

### 📈 시각화
- **ECharts 기반 차트**: 인터랙티브하고 반응형 차트
- **다양한 차트 타입**: 막대, 라인, 파이, 스캐터 차트 지원
- **실시간 차트 생성**: 데이터 선택에 따른 즉시 시각화
- **집계 기능**: 합계, 평균, 개수, 최댓값, 최솟값 집계
- **차트 내보내기**: 이미지로 차트 저장 가능

### 🎨 사용자 인터페이스
- **직관적인 3단계 워크플로우**: 업로드 → 선택 → 분석
- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **모던 UI**: Tailwind CSS와 shadcn/ui 기반 세련된 인터페이스
- **다크 모드 지원**: 눈의 피로를 줄이는 다크 테마

## 🛠️ 기술 스택

### Frontend
- **Next.js 14**: React 기반 풀스택 프레임워크
- **TypeScript**: 타입 안전성과 개발 생산성
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui**: 재사용 가능한 UI 컴포넌트
- **Lucide React**: 아이콘 라이브러리

### 데이터 처리
- **Papa Parse**: CSV 파일 파싱
- **SheetJS**: Excel 파일 처리
- **ECharts**: 고성능 차트 라이브러리

### 업로드 & 파일 관리
- **React Dropzone**: 드래그 앤 드롭 파일 업로드
- **Node.js File System**: 서버사이드 파일 처리

## 🚦 시작하기

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd data-analysis-tool
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm run dev
```

4. **브라우저에서 접속**
```
http://localhost:3000
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📖 사용법

### 1단계: 파일 업로드
- 메인 페이지에서 "파일 업로드" 섹션으로 이동
- 파일을 드래그 앤 드롭하거나 클릭하여 업로드
- 지원 형식: CSV, Excel, JSON, TSV, TXT

### 2단계: 파일 선택
- 업로드된 파일 목록에서 분석할 파일 선택
- 파일 정보 (크기, 형식, 수정일) 확인

### 3단계: 데이터 분석
- **데이터 미리보기**: 처음 10개 행과 모든 컬럼 확인
- **통계 정보**: 각 컬럼의 상세 통계 정보 확인
- **차트 생성**: 원하는 차트 타입과 축 설정하여 시각화

### 차트 생성 가이드

1. **차트 타입 선택**: 막대, 라인, 파이, 스캐터 중 선택
2. **X축 설정**: 카테고리나 독립변수 컬럼 선택
3. **Y축 설정**: 값이나 종속변수 컬럼 선택 (파이 차트 제외)
4. **집계 방법**: 합계, 평균, 개수, 최댓값, 최솟값 중 선택
5. **제목 입력**: 차트 제목 커스터마이징
6. **실시간 미리보기**: 설정에 따른 즉시 차트 생성

## 📁 프로젝트 구조

```
data-analysis-tool/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 라우트
│   │   └── page.tsx        # 메인 페이지
│   ├── components/         # React 컴포넌트
│   │   ├── ui/            # 기본 UI 컴포넌트
│   │   ├── charts/        # 차트 컴포넌트
│   │   ├── FileUpload.tsx # 파일 업로드
│   │   ├── FileList.tsx   # 파일 목록
│   │   ├── DataPreview.tsx # 데이터 미리보기
│   │   └── ChartBuilder.tsx # 차트 생성기
│   ├── lib/               # 유틸리티 함수
│   │   ├── utils.ts       # 공통 유틸리티
│   │   └── dataParser.ts  # 데이터 파싱
│   └── types/             # TypeScript 타입 정의
├── public/                # 정적 파일
├── uploads/              # 업로드된 파일 저장소
└── package.json
```

## 🔧 API 엔드포인트

### POST /api/upload
파일 업로드 처리
- **Request**: FormData with file
- **Response**: 업로드 결과 및 파일 정보

### GET /api/files
업로드된 파일 목록 조회
- **Response**: 파일 목록과 메타데이터

### POST /api/parse
파일 파싱 및 데이터 분석
- **Request**: `{ filename: string }`
- **Response**: 파싱된 데이터셋과 통계 정보

## 🎯 향후 계획

### 머신러닝 기능
- [ ] 선형/다항 회귀 분석
- [ ] 분류 알고리즘 (로지스틱 회귀, 의사결정트리)
- [ ] 클러스터링 (K-means)
- [ ] 이상치 탐지

### AI 통합
- [ ] OpenAI API 연동
- [ ] 자동 데이터 인사이트 생성
- [ ] 자연어 쿼리 지원
- [ ] 예측 모델 추천

### 고급 기능
- [ ] 실시간 데이터 스트리밍
- [ ] 협업 기능 (공유, 댓글)
- [ ] 대시보드 저장/불러오기
- [ ] 데이터 내보내기 (PDF, Excel)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이센스

이 프로젝트는 MIT 라이센스 하에 있습니다.

## 📞 지원

문제나 제안사항이 있으시면 GitHub Issues를 통해 연락해 주세요.

---

**Made with ❤️ using Next.js, TypeScript, and ECharts**
