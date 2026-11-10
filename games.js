window.PORTFOLIO = {
  name: '김준식',
  games: [
    {
      id:'alkkagi',title:'LUCKY FLICK SURVIVOR',subtitle:'알까기 생존 액션. 한 번의 조준으로 뒤집는 전장.',engine:'Unity 6 · C#',category:'액션',status:'Windows 빌드 · 실제 조작 확인',year:'2026',featured:true,
      description:'돌을 드래그해 방향과 힘을 정하고 충돌로 적을 제거하는 알까기형 생존 액션. 초기 개발 발표 자료와 현재 Lucky Flick Survivor 빌드를 함께 기록했습니다. 빌드에서 직접 발사·적 처치·레벨업 선택까지 확인했습니다.',
      features:['드래그 조준·발사·충돌 전투','적 누적과 생존 목표','레벨업 3택 성장','회전 검·감속 저항·화살 발사'],
      images:[{src:'media/lucky-play.webp',alt:'Lucky Flick Survivor 알까기 실제 플레이 화면',caption:'직접 실행해 촬영한 Windows 빌드 · 알까기 플레이'},{src:'media/lucky-title.webp',alt:'Lucky Flick Survivor 타이틀',caption:'직접 실행한 빌드 · 타이틀'},{src:'media/lucky-growth.webp',alt:'알까기 적 처치 후 세 가지 성장 선택',caption:'직접 조작 후 촬영 · 레벨업 선택'},{src:'media/alkkagi-play.webp',alt:'알까기 초기 프로토타입 돌 배치',caption:'1주차 개발 발표 자료의 Game 뷰 · 초기 프로토타입'},{src:'media/alkkagi-aim.webp',alt:'알까기 초기 조준 방향 표시',caption:'1주차 개발 발표 자료 · 조준'},{src:'media/alkkagi-growth.webp',alt:'알까기 초기 능력 선택 화면',caption:'1주차 개발 발표 자료 · 성장 선택'},{src:'media/alkkagi-end.webp',alt:'알까기 초기 게임오버 화면',caption:'1주차 개발 발표 자료 · 게임오버'}],
      videos:[{src:'media/lucky-play.mp4',poster:'media/lucky-play.webp',title:'알까기 · 직접 플레이 녹화',caption:'실제 Windows 빌드 조작 · 드래그 발사 → 적 처치 → 레벨업 선택 · 14초 · 무음'}]
    },
    {
      id: 'rift-manager', title: 'RIFT MANAGER', subtitle: '팀을 설계하고, 전장을 지배하다.',
      engine: 'Unity 6 · C#', category: '시뮬레이션', status: 'Windows 빌드', year: '2026', featured: true,
      description: '영웅 조합과 드래프트로 전장을 설계하는 5 대 5 자동 공성 게임. 낙하한 자 — Arena of Fate 이후 확장한 프로젝트입니다.',
      features: ['100명 영웅과 400개 스킬', '드래프트와 19종 증강', '포탑·본진 공성 및 10인 전투 로스터', '초대코드 기반 1 대 1 대전'],
      images: [{src:'media/rift-gameplay.webp',alt:'RIFT MANAGER 전장과 팀 로스터',caption:'실제 게임 캡처 · 공성 전투 HUD'},{src:'media/rift-title.webp',alt:'RIFT MANAGER 시작 화면',caption:'실제 게임 캡처 · 50명 로스터 시기의 초기 타이틀'}],
      videos: [{src:'media/rift-battle.mp4',poster:'media/rift-gameplay.webp',title:'100명 로스터 · 자동전투',caption:'개발 검증용 자동전투 GIF를 MP4로 변환한 영상 · 약 7초'}]
    },
    {
      id: 'star-eleven', title: 'STAR ELEVEN', subtitle: '별의 스트라이커. 나만의 축구 커리어.',
      engine: 'Unity 6 · C#', category: '스포츠', status: 'Windows 빌드', year: '2026', featured: true,
      description: '11 대 11 자동 축구와 선수 성장, 훈련, 경기 후 평가를 연결한 축구 커리어 게임. 필살기 컷인과 골 리플레이로 경기의 순간을 연출합니다.',
      features: ['11 대 11 경기와 선수 체력', '훈련·주간 커리어·경제 시스템', '스킬 연출과 성장', '골 리플레이·세리머니·경기 후 코치 평가'],
      images: [{src:'media/football-match.webp',alt:'STAR ELEVEN 11 대 11 축구 경기',caption:'실제 게임 캡처 · 경기 화면'},{src:'media/football-career.webp',alt:'STAR ELEVEN 선수 커리어 화면',caption:'실제 게임 캡처 · 커리어 메뉴'},{src:'media/football-thunder.webp',alt:'번개와 축구공의 AI 생성 시네마틱 실험',caption:'AI 생성 시네마틱 실험 · 게임 미통합 · 실제 게임 화면 아님'}],
      videos: [{src:'media/football-skill.mp4',poster:'media/football-match.webp',title:'Thunder Shot · 경기 속 스킬 연출',caption:'스킬 컷인에서 경기 복귀까지 · 개발 캡처 GIF를 MP4로 변환'},{src:'media/football-thunder.mp4',poster:'media/football-thunder.webp',title:'시네마틱 실험 · 게임 미통합',caption:'AI 생성 시네마틱의 192프레임 보간 실험 · 60Hz · 실제 플레이 영상 아님'}]
    },
    {
      id:'dungeon',title:'ESCAPE FROM DUNGEON',subtitle:'가져갈 것인가, 살아서 돌아갈 것인가.',engine:'Unity 6 · URP 2D',category:'RPG',status:'모바일 세로형 프로젝트',year:'2026',featured:true,
      description:'세로 화면으로 구성한 턴제 추출 로그라이트. 던전의 전투와 도주, 가방 관리, 캠프의 준비 과정을 연결합니다.',
      features:['1080 × 2340 세로형 UI','턴제 전투·도주','가방과 추출 선택','캠프·상점·제단'],
      images:[{src:'media/dungeon.webp',alt:'Escape from Dungeon 세로형 턴제 전투 화면',caption:'실제 게임 캡처 · 턴제 전투'}],videos:[]
    },
    {
      id:'arena-unreal',title:'원형 경기장',subtitle:'한 판 뒤집어. 원형 투기장 멀티플레이.',engine:'Unreal Engine 5.8 · C++',category:'액션',status:'대전 프로토타입 · 빌드 있음',year:'2026',featured:false,
      description:'원형 투기장에서 싸우는 리슨서버 대전 프로토타입. 최대 8인 연결 구조와 9종 캐릭터, 무기 순환, 대시 공격을 구현했습니다.',
      features:['IP 방 만들기·참가','3분 경기·목숨 3개','9종 캐릭터·건틀릿/검/망치','대시 공격·넉다운·가드'],
      images:[{src:'media/arena-unreal.webp',alt:'원형 경기장 Unreal 게임 플레이 화면',caption:'실제 게임 캡처 · 경기장과 캐릭터 HUD'}],
      videos:[{src:'media/arena-promo.mp4',poster:'media/arena-unreal.webp',title:'원형 경기장 · 30초 프로모',caption:'게임 캡처 기반 편집 프로모 영상 · 30초 · 소리 있음'}]
    },
    {
      id:'last-verdict',title:'최후의 평결',subtitle:'일하고, 의심하고, 살아남는다.',engine:'Unity 6 · Netcode / Relay',category:'추리',status:'Windows 빌드 · 0.6.0',year:'2026',featured:false,
      description:'감시 카메라가 있는 시설에서 돈을 벌고 생존 상태를 관리하는 6~10인 1인칭 멀티플레이 게임. 재산과 탈출권, 신고와 투표가 경쟁을 만듭니다.',
      features:['초대코드 방과 AI 연습','5종 작업 미니게임','상점·배송·절도·신고·투표','생존 상태·근접 음성·유령 관전'],
      images:[{src:'media/last-verdict.webp',alt:'최후의 평결 1인칭 시설과 상태 HUD',caption:'실제 게임 캡처 · 시설 탐색'}],videos:[]
    },
    {
      id:'aurora',title:'AURORA',subtitle:'REMOTE CONTROL. 시설을 탈출하라.',engine:'Unity 6 · URP',category:'추리',status:'Windows 빌드',year:'2026',featured:false,
      description:'4~10인이 참여하는 1인칭 시설 탈출 게임. 6종 직업과 원격 개입 능력을 중심으로 협력과 방해가 교차합니다.',
      features:['초대코드 방 만들기·참가','6종 직업','침입자의 원격 정전·해킹','문 봉쇄와 시설 탈출'],
      images:[{src:'media/aurora.webp',alt:'AURORA 시설 탈출 방 생성 화면',caption:'실제 게임 캡처 · 6~10인 초기 프로토타입 0.1 메뉴'}],videos:[]
    },
    {
      id:'mafia',title:'정글의 마지막 식량',subtitle:'공유하는 식량, 숨겨진 스파이.',engine:'Unity 6 · C#',category:'추리',status:'멀티플레이 빌드',year:'2026',featured:false,
      description:'정글에서 공용 식량을 두고 생존하는 6인 스파이 게임. 낮과 밤, 허기와 식량 채집이 협력과 의심의 조건이 됩니다.',
      features:['6인 스파이 생존 규칙','4일간의 낮·밤 진행','식량 채집·허기·과식','호스트·게스트 접속'],
      images:[{src:'media/mafia.webp',alt:'정글의 마지막 식량 3D 플레이 화면',caption:'실제 개발 캡처 · 호스트/게스트 연결 화면'}],videos:[]
    },
    {
      id:'arena-fate',title:'낙하한 자',subtitle:'ARENA OF FATE. 운명에서 전술로.',engine:'Unity 6 · URP',category:'시뮬레이션',status:'Windows 빌드',year:'2026',featured:false,
      description:'무작위 출신과 자산, 전직을 받고 투기장에 들어가는 탑다운 자동전투 게임. 이후 RIFT MANAGER로 이어진 전작입니다.',
      features:['6종 출신 패시브와 생존기술','태세 전환형 자동전투','최대 8명의 적·전투 AI','무기 상점·보상·사망 시 런 초기화'],
      images:[{src:'media/arena-fate.webp',alt:'낙하한 자 투기장 전투와 캐릭터 정보',caption:'실제 게임 캡처 · 투기장 자동전투'}],videos:[]
    },
    {
      id:'team-rpg',title:'TeamRPG',subtitle:'보스와 구출, 3D 액션 RPG.',engine:'Unity · URP',category:'RPG',status:'소스 프로젝트',year:'2026',featured:false,
      description:'드래곤 보스와 구출 흐름, 대장간을 구성한 3D 액션 RPG 프로젝트. 확보한 자료는 소스이며, 이번 조사에서 플레이 캡처와 배포 빌드는 찾지 못했습니다.',
      features:['드래곤 보스','구출 루프','대장간','미니맵'],images:[],videos:[]
    },
    {
      id:'nightfall-survivor',title:'NIGHTFALL SURVIVOR',subtitle:'밤을 버티는 5분.',engine:'Unity 6 · 2D',category:'액션',status:'소스 프로토타입',year:'2026',featured:false,
      description:'5분 생존과 보스전을 목표로 한 자동사격 생존 프로젝트. NightfallSurvivor와 Unity2D 폴더를 동일 계열로 묶었습니다. 빌드와 실행 화면은 확인되지 않았습니다.',
      features:['자동사격','5분 생존 구조','보스전','8종 강화'],images:[],videos:[]
    },
    {
      id:'color-run',title:'COLOR RUN',subtitle:'달리고, 색을 바꾸고.',engine:'Unity · C#',category:'아케이드',status:'초기 제작 프로젝트',year:'2026',featured:false,
      description:'색 전환을 중심으로 한 러너 프로젝트. ColorRun과 RunGame 계열 자료를 하나로 모았습니다. 이번 조사에서 플레이 영상은 찾지 못했습니다.',
      features:['색 전환 러너','스킨 상점'],images:[],videos:[]
    },
    {
      id:'necro-climb',title:'NECRO CLIMB',subtitle:'공개 GitHub 기록에서 찾은 또 하나의 게임.',engine:'엔진 미확인',category:'기타',status:'공개 정책 문서 확인 · 소스 미확보',year:'2026',featured:false,
      description:'기존 GitHub 계정의 공개 정책 문서에서 게임 이름을 확인했습니다. 로컬 소스와 플레이 자료는 찾지 못했으므로 장르·출시 여부·플레이 기능은 단정하지 않습니다.',
      features:['2026년 11월 6일 공개 정책 문서','Google 로그인·진행 저장 정책 기재','실제 구현과 출시 상태는 미확인'],images:[],videos:[]
    },
    {
      id:'dice-man',title:'DICE MAN',subtitle:'운명을 굴리고, 다음 전투를 준비하다.',engine:'Unity 6 · 세로형 UI',category:'RPG',status:'개발 프로젝트 · 모바일 실기기 미검증',year:'2026',featured:false,
      description:'선택형 이야기 게임 열 번째 밤에서 출발해 주사위 전투와 영구 성장으로 발전한 프로젝트. 성격·직업·종족을 선택하고 D6 결과로 전투를 진행합니다.',
      features:['성격·직업·종족 3단계 선택','물리·마법·쉴드·상태·아이템·추가턴 D6','황금 주사위·3전투마다 보스','슬롯머신 기반 영구 성장'],
      images:[{src:'media/dice-combat.webp',alt:'Dice Man 주사위 전투 화면',caption:'실제 개발 캡처 · 주사위 전투'},{src:'media/dice-menu.webp',alt:'Dice Man 메뉴 화면',caption:'실제 개발 캡처 · 메뉴'}],videos:[]
    },
    {
      id:'tom-and-jerry',title:'TomAndJerry',subtitle:'장산범과 삼미호, 엔진을 넘나든 캐릭터 연구.',engine:'Unreal Engine / Unity',category:'실험',status:'캐릭터 프로토타입 · 엔진 이식',year:'2026',featured:false,
      description:'Unreal 3인칭 템플릿 기반의 캐릭터 작업과 Unity 이식 프로젝트. 장산범·삼미호의 이동과 캐릭터 표현을 확인했으며, 완성된 게임 플레이 루프는 확인되지 않았습니다.',
      features:['장산범·삼미호 캐릭터','3인칭 대기·걷기·달리기','Unity 이식 및 씬 배치 검토'],
      images:[{src:'media/tom-jerry.webp',alt:'Unreal 장산범 캐릭터 쇼케이스',caption:'엔진 캐릭터 쇼케이스 · 완성 게임 플레이 캡처 아님'}],videos:[]
    },
    {
      id:'fps-lab',title:'VARCO FPS LAB',subtitle:'이동과 무기의 감각을 실험하다.',engine:'Unity 6 · URP',category:'실험',status:'vcstest · FPS 샌드박스',year:'2026',featured:false,
      description:'varcotest 프로젝트의 1인칭 이동·무기 샌드박스. BhopTest 씬과 스나이퍼·칼·무기 교체 코드를 확인했습니다. 완성 게임이 아닌 조작 실습입니다.',
      features:['1인칭 이동 실습','스나이퍼 라이플·칼','무기 전환·뷰모델'],images:[],videos:[]
    },
    {
      id:'greed-armor',title:'GREED ARMOR',subtitle:'도자기 갑옷, 단일 아레나 전투 실험.',engine:'Unity 6 · URP 3D',category:'실험',status:'전투 기술 데모 · 에디터 전용',year:'2026',featured:false,
      description:'모듈형 도자기 갑옷과 리타게팅에서 출발한 단일 아레나 전투 프로토타입. 실제 판정·방어·회피·승패·장비 교체를 구현했지만, 스테이지 콘텐츠와 저장을 갖춘 완성 게임은 아닙니다.',
      features:['20파츠 갑옷 조립·전완 교체','Humanoid 애니메이션 리타게팅','근접 판정·전면 방어·회피 무적','적 AI·승패·재시작·장비 트레이드오프'],
      images:[{src:'media/last-armor.webp',alt:'Greed Armor 도자기 전신 갑옷',caption:'실시간 엔진 캡처 · 갑옷 아트 검토'},{src:'media/last-combat.webp',alt:'Greed Armor 아레나의 두 전투 캐릭터',caption:'실시간 엔진 캡처 · 단일 아레나 전투 씬'},{src:'media/last-armor-front.webp',alt:'Greed Armor 갑옷 정면',caption:'실시간 엔진 캡처 · 정면 형상'}],videos:[]
    }
  ],
  notes: [
    '게임·과제·프로토타입·기술 데모를 상태별로 구분한 제작 아카이브입니다. 소개된 기능은 프로젝트 자료 기준이며, 모든 게임을 새로 빌드하거나 실행 검증했다는 뜻은 아닙니다.',
    '플레이 녹화, 편집 프로모, 개발 캡처 영상, AI 시네마틱 실험은 각 미디어의 설명으로 구분합니다. 이미지를 찾지 못한 프로젝트에는 다른 게임의 화면을 대신 사용하지 않습니다.',
    '백업·배포판·동일 프로젝트 사본은 하나로 묶고, 원본 소스와 개인 파일은 이 사이트에 포함하지 않습니다.',
    '열 번째 밤 웹 프로토타입은 Dice Man의 전신입니다. 알까기는 초기 돌 게임에서 생존 액션으로 발전한 이력과 Lucky Flick Survivor 실행 빌드를 함께 소개합니다. ColorRun/RunGame, NightfallSurvivor/Unity2D 및 날짜가 붙은 백업 폴더는 중복으로 세지 않습니다.',
    'Unity6.6_URPSample과 unity6.6URPTanks는 공식 샘플·튜토리얼로, 독립 창작 게임에서 제외했습니다. Arena·2d PracticeGame은 빈 템플릿, Chaming Stone은 돌 자산 실험으로 분류했습니다.',
    'CSharpPractice의 탄환 발사, My project 3D의 이동 연습, effect의 효과 실습 및 JUST의 갑옷 아트 작업도 조사 범위에 포함했습니다. 게임 내용 없는 저장소와 기초 실습 폴더는 별도 집계하지 않으며, 독립 FPS 샌드박스는 실험 기록으로 포함합니다.',
    '알까기 영상은 LuckyFlickBuild를 직접 실행해 촬영했습니다. 기존 My project라는 빌드 파일명 대신 화면에서 확인한 Lucky Flick Survivor 타이틀을 사용합니다. 상용 게임 녹화와 개인 자료는 제외했습니다.'
  ]
};
