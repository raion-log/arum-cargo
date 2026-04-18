# 아름 카고 (Arum Cargo)

> **항공 화물 업계 현직자가 매일 아침 정리해주는 업계 뉴스 + 채용 허브.**

구 RAION Aviation DX Hub. [ADR-008 Cargo-First Pivot](docs/adr/ADR-008-pivot-to-cargo-first.md) (2026-04-11)에 따라 승무원·지상직·조종사 중심 A-Side에서 **항공 화물 중심**으로 전면 재정렬되었다.

## 한 줄 포지셔닝

- **대상**: 2~5년차 콘솔사·포워더 항공화물 영업·오퍼 (페르소나 C1 이지훈)
- **약속**: 출근길 5분 안에, 나답게 일할 수 있게 해주는 한 통의 이메일
- **차별**: 11년차 항공 화물 현직자의 **에디터 Pick** — 한국 시장 공백 100% 영역

## Phase 5 MVP 스코프

| 블록 | 기능 |
|---|---|
| **I-Side — 카고 뉴스** | 국내/해외 카고 뉴스 통합 피드 · 에디터 Pick · LLM 한글 요약 · 항공·카고 용어 툴팁 |
| **A-Side — 카고 채용** | 카고 직군 공고 통합 · 하이브리드 큐레이션(pending→approved) · 신뢰도 점수 · 14개 카고 기업 공식 채용 딥링크 |
| **Email Growth Loop** | 더블 옵트인 구독 · 07:00 KST 일일 다이제스트 · 원클릭 수신거부 · 공유 루프 |
| **관리자 대시보드** | Supabase Magic Link 인증 · shadcn/ui charts 8 KPI 카드 · 뉴스/채용 승인 큐 |
| **법정 페이지** | `/privacy` · `/terms` · `/about` (개인 식별정보 비공개) |

**North Star**: WAU (Weekly Active Subscribers) 500 · 4주 유지율 ≥ 40% (Reforge PMF 기준)

## 기술 스택 (SRS [C-TEC-001~025](docs/srs/SRS-001-arum-cargo.md))

| 레이어 | 선택 |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + lucide-react |
| 모션 | **Framer Motion** + tailwindcss-animate + react-intersection-observer |
| 폰트 | Pretendard Variable + Space Grotesk + JetBrains Mono |
| 차트 | **shadcn/ui charts (Recharts 래퍼) 단일** — 관리자·사용자 공통 |
| DB | Supabase (PostgreSQL + RLS + Magic Link) |
| Email | Loops.so (무료 2,000 contacts) |
| LLM 번역 | **Provider-Agnostic** (`TRANSLATION_PROVIDER=openai\|gemini\|anthropic`, MVP 기본 openai=GPT-4o-mini) |
| Cron | Vercel Cron (다이제스트) + GitHub Actions (ingest) 하이브리드 |
| 배포 | Vercel Hobby (`arumcargo.vercel.app`) |

**월 인프라 비용 상한**: ₩100,000. 현재 실측 예상 ~₩7,500/월.

## Repository Layout

```
arum-cargo/
├── CLAUDE.md               # 프로젝트 컨텍스트 (Claude Code·협업자용)
├── README.md               # 이 파일
├── docs/
│   ├── references/         # 사업 전략 SSOT (01~17)
│   ├── prd/                # 제품 요구사항 명세 (00~07, 99) v0.3
│   ├── srs/                # SRS (Software Requirements Specification) Rev 0.9.2
│   ├── adr/                # 아키텍처 결정 기록 (001~008)
│   ├── glossary.md
│   └── open-questions.md
└── web/                    # Next.js 14 프로젝트 (Phase 2에서 생성)
```

## 문서 진입점

- [CLAUDE.md](./CLAUDE.md) — 에이전틱 개발 규칙·기술 스택·환경변수
- [docs/prd/00-overview.md](./docs/prd/00-overview.md) — 제품 앵커 PRD
- [docs/srs/SRS-001-arum-cargo.md](./docs/srs/SRS-001-arum-cargo.md) — SRS Rev 0.9.2 (ISO/IEC/IEEE 29148:2018)
- [docs/adr/](./docs/adr/) — 주요 기술 결정
- [docs/open-questions.md](./docs/open-questions.md) — 결정 유보 항목

## Status

- [x] **Phase 0**: 레퍼런스 SSOT
- [x] **Phase 0.8**: Cargo-First Pivot (ADR-008)
- [x] **Phase 1**: PRD v0.3
- [x] **Phase 1.5**: SRS Rev 0.9.2 (v1.0 승격 대기: OQ-M6 Loops §50 검증 + OQ-R3/R4 RSS 확인)
- [ ] **Phase 2**: Next.js 프로젝트 셋업 (`web/`)
- [ ] **Phase 3**: UI (Mock 데이터)
- [ ] **Phase 4**: 외부 API 연동
- [ ] **Phase 5**: Supabase + Loops + 관리자 대시보드 🏁 (MVP 완성)
- [ ] **Phase 5.5**: `/employers` + `/flights` + 기종 capacity

## License

작성 중 (사업 민감도 판단 후 결정).

## Contact

운영자는 11년차 항공 화물 현직자. 실명·소속·직책은 비공개. 제휴·채용 문의는 `/employers` (Phase 5.5) 개시 후.
