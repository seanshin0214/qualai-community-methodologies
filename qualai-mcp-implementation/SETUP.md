# QualAI MCP 서버 설정 가이드

이 디렉토리에는 refineCodebook, extractThemes, buildGroundedTheory를 구현한 파일들이 있습니다.

## 📁 포함된 파일

- `src/analysis/theory-engine.ts` - 새로 만든 TheoryEngine (Grounded Theory 구축)
- `src/index.ts` - 3개 도구가 연결된 메인 서버 파일
- `package.json` - 의존성 목록
- `tsconfig.json` - TypeScript 설정
- `README.md` - 원본 README

## 🚀 새 저장소에 적용하기

### 1. 새 저장소 클론

```bash
cd ~
git clone https://github.com/amnotyoung/qualai-mcp.git
cd qualai-mcp
```

### 2. 구현 파일 복사

```bash
# 현재 위치: ~/qualai-mcp

# theory-engine.ts 복사 (완전 신규 파일)
cp ~/qualai-community-methodologies/qualai-mcp-implementation/src/analysis/theory-engine.ts src/analysis/

# index.ts 복사 (수정된 파일)
cp ~/qualai-community-methodologies/qualai-mcp-implementation/src/index.ts src/
```

### 3. 빌드 & 테스트

```bash
npm install
npm run build
```

### 4. 커밋 & 푸시

```bash
git add src/analysis/theory-engine.ts src/index.ts
git commit -m "Implement refineCodebook, extractThemes, buildGroundedTheory

- Created TheoryEngine for grounded theory construction
- Connected all tools to MCP handlers
- Auto-coding on data upload
- Complete analysis workflow available"

git push origin master
```

## 🔍 구현된 기능

### refineCodebook
- 초기 코드 정제 및 병합
- 계층 구조 생성
- 프로젝트 메타데이터에 저장

### extractThemes
- Inductive/Deductive 모드
- 3단계 분석 깊이
- 테마 관계 매핑

### buildGroundedTheory
- 핵심 범주 식별
- 패러다임 모델 구축
- 이론적 스토리라인 생성

## 📊 전체 워크플로우

```
createProject
  → addDataSource (자동 코딩)
  → refineCodebook
  → extractThemes
  → buildGroundedTheory
```

## 📚 자세한 내용

상세 구현 설명은 `../QUALAI_MCP_IMPLEMENTATION_SUMMARY.md`를 참고하세요.
