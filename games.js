window.PORTFOLIO = {
  name: '김준식',
  games: [
    {
      id:'necro-climb',title:'NECRO CLIMB',subtitle:'망자의 군단을 세워 인간의 성채를 오르는 세로형 강령술사 기지전.',
      engine:'Unity 6 · C#',category:'디펜스',status:'Windows·Android 테스트 빌드 · 직접 실행 확인',year:'2026',final:true,featured:true,period:'2026.11.02 – 11.10',
      tools:['Unity 6','코드로 생성한 3D 메시','pixelfx(MIT) 기반 2D 원형 스프라이트'],
      description:'금화로 12칸 건설 슬롯에 건물을 지으면 해골 군단이 자동으로 생산되어 북쪽 인간 기지로 진군합니다. 3장 × 7층 분기 지도를 오르며 전투·사건·상점을 고르고, 건물 강화와 유물로 원정을 키웁니다. 최신 v1.9 빌드를 직접 플레이해 건설, 수호자 강림, 강화·유물 선택까지 확인했으며, 스토어 출시와 실기기 검증은 아직 하지 않았습니다.',
      features:['건물 10종이 해골 9종을 자동 생산하는 12칸 기지 건설','3장 × 7층 분기 루트맵 · 전투·사건·상점·엘리트·성채','승리마다 건물 강화 3택 · 엘리트 승리 시 유물 3택(10종)','기지 체력 30% 수호자 강림 · 봉인 조각 3개 후 최종 결전'],
      history:['11.02 · 2D 픽셀 방 단위 액션 원형','11.03 · 3D 룩 스터디 후 강령술사 직접 조작 v1.2–v1.4','11.04–11.05 · 공성·사가·챔피언(v1.5–v1.7)','11.06 · v1.8 기지 건설형으로 전환','11.09–11.10 · v1.9 여정·상점·흑요석 UI'],
      images:[
        {src:'media/necro-guardian.webp',alt:'망자 기사 수호자와 쓰러진 인간 병사',caption:'직접 실행 캡처 · v1.9 · 아군 수호자(망자 기사) 강림',pos:'50% 30%'},
        {src:'media/necro-title.webp',alt:'NECRO CLIMB 타이틀',caption:'프로젝트 내 UI 검증 캡처 · 타이틀 "초보 강령술사"',pos:'50% 35%'},
        {src:'media/necro-battle.webp',alt:'영웅 돌진 범위 경고가 뜬 첫 전투',caption:'직접 실행 캡처 · 1장 첫 전투, 영웅 돌진 경고',pos:'50% 30%'},
        {src:'media/necro-build.webp',alt:'건설칸 시트와 건물 10종',caption:'직접 실행 캡처 · 건설 시트(건물·가격·생산 수치)',pos:'50% 70%'},
        {src:'media/necro-upgrade.webp',alt:'승리 후 건물 강화 3택',caption:'직접 실행 캡처 · 승리 후 건물 강화 선택',pos:'50% 40%'},
        {src:'media/necro-map.webp',alt:'7층 분기 지도',caption:'직접 실행 캡처 · 1장 국경 성채 분기 지도',pos:'50% 50%'},
        {src:'media/necro-relic.webp',alt:'유물 3택 화면',caption:'직접 실행 캡처 · 유물 선택',pos:'50% 30%'},
        {src:'media/necro-2d-prototype.webp',alt:'2D 픽셀 원형 전투 화면',caption:'개발 초기 2D 원형(11.02) · 프로젝트 내 기존 캡처'}
      ],
      videos:[
        {src:'media/necro-guardian.mp4',poster:'media/necro-guardian.webp',title:'NECRO CLIMB · 수호자 강림',caption:'v1.9 Windows 빌드 직접 플레이 · 기지 체력 30% 이하 수호자 강림 → 반격 · 14초 · 무음'},
        {src:'media/necro-build.mp4',poster:'media/necro-build.webp',title:'NECRO CLIMB · 전투 중 건설',caption:'v1.9 Windows 빌드 직접 플레이 · 영웅 돌진 경고 → 뼈 사격장 건설 · 14초 · 무음'}
      ]
    },
    {
      id:'football-director',title:'한빛 감독 축구',subtitle:'필살기가 터지는 11 대 11, 나는 감독이다.',
      engine:'Unity 6 · C#',category:'스포츠',status:'개발 중 · Windows 개발 빌드 · Android APK(실기기 미검증)',year:'2026',final:true,featured:true,period:'2026.11.09 –',
      tools:['Unity 6','AI 생성 선수·컷인·필살기 아트(gpt-image)'],
      description:'안드로이드 가로형을 목표로 만드는 2D 필살기 축구 감독 게임입니다. 경기 중 이동·패스·슛·선방·필살기는 모두 자동이고, 플레이어는 선발·포메이션·전술을 짜고 이적시장에서 선수를 영입하며 리그와 컵을 운영합니다. 결과를 미리 정하지 않고 위치·공 높이·몸 충돌을 계산하는 시뮬레이션으로 경기를 진행합니다. 게임 이름은 아직 임시입니다.',
      features:['30틱/초 위치 기반 11 대 11 자동 경기 · 공 높이·바운드·몸 충돌','9계열 × 4등급 필살기 36종과 클로즈업 컷인','슛이 키퍼 손에 닿으면 2초간 힘겨루기하는 골키퍼 격돌','이적시장·4팀 리그·컵·트로피에 따른 고등급 선수 확률'],
      images:[
        {src:'media/hanbit-clash.webp',alt:'골키퍼와 슈터의 필살기 격돌',caption:'프로젝트 내 기존 캡처 · 실제 경기(시드 35) 중 골키퍼 격돌 · 화면 속 일러스트는 AI 생성 에셋'},
        {src:'media/hanbit-match.webp',alt:'사이드라인 중계 시점의 11대11 경기',caption:'프로젝트 내 기존 캡처 · 중계 시점의 자동 경기'},
        {src:'media/hanbit-cutin.webp',alt:'필살 슛 섬광 발리 컷인',caption:'프로젝트 내 기존 캡처 · 필살 슛 컷인'},
        {src:'media/hanbit-skills.webp',alt:'9계열 필살기 발동 장면 모음',caption:'프로젝트 내 기존 캡처를 축소·합성한 9계열 필살기 모음'},
        {src:'media/hanbit-transfer.webp',alt:'이적시장 화면',caption:'프로젝트 내 기존 캡처 · 이적시장(등급 확률·영입 후보)'},
        {src:'media/hanbit-lineup.webp',alt:'포메이션과 선발 화면',caption:'프로젝트 내 기존 캡처 · 경기 준비(포메이션·선발)'}
      ],
      videos:[{src:'media/hanbit-clash.mp4',poster:'media/hanbit-clash.webp',title:'골키퍼 격돌 · 연속 프레임',caption:'실제 경기 캡처 13장을 0.15초 간격으로 이은 2초 영상 · 실시간 녹화 아님 · 무음'}]
    },
    {
      id:'mallang-shelter',title:'말랑이 보호소',subtitle:'경계하는 모찌와 천천히 친해지는 힐링 돌봄.',
      engine:'Unity 6 · URP 3D · C#',category:'시뮬레이션',status:'Android APK·Windows 테스트 빌드 · 직접 실행 확인 · 실기기 미검증',year:'2026',final:true,featured:true,period:'2026.11.09 – 11.10',
      description:'세로형 모바일을 목표로 한 3D 힐링 돌봄 게임입니다. 처음에는 경계하는 햄스터 모찌가 보내는 신호를 읽고 손을 거두거나 짧게 응답하며 천천히 신뢰를 쌓고, 친해지면 간식 찾기 놀이에서 모찌가 도움을 청하거나 간식을 나눠 줍니다. 모델·소품·UI 도형을 에디터 코드로 생성했으며, 카툰 빌드를 직접 실행해 자동 테스트 24/24 통과를 확인했습니다.',
      features:['식사·눈맞춤·손 내밀기로 이어지는 신뢰 5단계 관계','먹이 취향과 포만·긴장 규칙 · 꺼져 있을 때 멈추는 돌봄 시계','관계 단계마다 반응이 달라지는 간식 찾기 놀이','0.25m 격자 경로 이동과 가구 충돌 · 절차적 카툰 모델과 툰 셰이더'],
      history:['11.09 · 보송한 털 버전','11.10 · 카툰 아트 방향 전환과 Android·Windows 빌드'],
      images:[
        {src:'media/mallang-sharing.webp',alt:'친구가 된 모찌가 간식을 나눠 주는 장면',caption:'프로젝트 내 기존 캡처 · 친구 모찌가 간식을 나눠 줌',pos:'50% 35%'},
        {src:'media/mallang-room.webp',alt:'보호소 방 전체',caption:'프로젝트 내 기존 캡처 · 보호소 방 전체(카툰 버전)',pos:'50% 30%'},
        {src:'media/mallang-eating.webp',alt:'경계 단계 첫 식사',caption:'프로젝트 내 기존 캡처 · 경계 단계 첫 식사',pos:'50% 30%'},
        {src:'media/mallang-help.webp',alt:'간식 찾기에서 도움을 요청하는 모찌',caption:'프로젝트 내 기존 캡처 · 간식 찾기 도움 요청',pos:'50% 30%'},
        {src:'media/mallang-details.webp',alt:'신뢰 상세 패널',caption:'프로젝트 내 기존 캡처 · 신뢰 상세 패널',pos:'50% 60%'}
      ],
      videos:[{src:'media/mallang-snack.mp4',poster:'media/mallang-help.webp',title:'말랑이 보호소 · 간식 찾기',caption:'카툰 빌드 직접 실행 녹화 · 자동 테스트가 가상 터치로 조작 · 도움 요청 → 천 들기 → 나눔 · 15초 · 무음'}]
    },
    {
      id:'pixel-frontier',title:'픽셀 전선',subtitle:'PIXEL FRONTIER · 왕국을 세우고, 끝없는 군단에 맞서라.',
      engine:'Unity 6 · C# · WebGL',category:'디펜스',status:'WebGL 빌드 · 직접 실행 확인',year:'2026',period:'2026.09.24 – 10.03',featured:true,
      tools:['Unity 6','이미지 생성 도구로 만든 2D 아트','Blender·VARCO 3D(시네마틱)'],
      description:'건물을 지어 병력을 구성하면 60초마다 아군이 자동으로 출전해 적 기지로 진군하는 2D 도트 자동전투 디펜스입니다. HTML/JavaScript 프로토타입에서 시작해 Unity 6로 옮겼고, 고급 건물·최종 진화·30스테이지 원정·게임오버 룰렛을 차례로 추가했습니다. WebGL 빌드를 직접 실행해 건설, 자동 출전, 기지 가디언 소환, 룰렛 보상까지 확인했습니다.',
      features:['4×8 건설 구역과 금광 경제 · 기본 6종 + 고급 5종 건물','60초 자동 출전 대열 전투 · 진영당 최대 240명','3레벨 강화 후 두 갈래 최종 진화와 병종 조합 4종','30스테이지 원정 · 체력 30% 기지 가디언 · 게임오버 룰렛 영구 강화'],
      history:['09.24 · HTML/JavaScript 프로토타입(4×4 부지, 2분 출전)','09.24 · Unity 6 이식','10.01 · 플레이 피드백 반영 확장(고급 건물·진화·조합)','10.03 · 30스테이지·룰렛·가디언 포함 WebGL 빌드','10.04 · VARCO 3D 모델을 Blender로 연출한 30초 시네마틱'],
      images:[
        {src:'media/pixel-frontier-guardian.webp',alt:'픽셀 전선 적 기지 가디언 출현과 교전',caption:'직접 플레이 녹화 프레임 · WebGL 빌드 · 적 기지 가디언과 아군 궁수·검병 교전'},
        {src:'media/pixel-frontier-deploy.webp',alt:'첫 출전한 검병 대열',caption:'직접 실행 캡처 · 1스테이지 첫 자동 출전'},
        {src:'media/pixel-frontier-golem.webp',alt:'아군 기지 강철 골렘 가디언 소환',caption:'직접 실행 캡처 · 아군 기지 체력 30% 이하에서 강철 골렘 가디언 소환'},
        {src:'media/pixel-frontier-buildings.webp',alt:'고급 건물 5종 카드',caption:'직접 실행 캡처 · Tab으로 전환한 고급 건물 카드'},
        {src:'media/pixel-frontier-roulette.webp',alt:'게임오버 원정 룰렛 희귀 보상',caption:'직접 실행 캡처 · 게임오버 룰렛 희귀 보상(영구 +10%) 자동 적용'},
        {src:'media/pixel-frontier-title.webp',alt:'픽셀 전선 시작 메뉴',caption:'직접 실행 캡처 · 시작 메뉴'},
        {src:'media/pixel-frontier-qa-army.webp',alt:'32칸 건설과 대군 배치 렌더',caption:'개발 검증용 Unity 렌더 · 테스트용으로 배치한 대군(골드 15,000) · 일반 플레이 상태 아님'},
        {src:'media/pixel-frontier-prototype.webp',alt:'초기 HTML JavaScript 프로토타입 전장',caption:'초기 HTML/JS 프로토타입 직접 실행 · Unity 이전 버전'}
      ],
      videos:[
        {src:'media/pixel-frontier-play.mp4',poster:'media/pixel-frontier-guardian.webp',title:'픽셀 전선 · 직접 플레이 녹화',caption:'WebGL 빌드 직접 플레이 · 4배속 · 출전·교전·적 가디언 소환 · 16초 · 무음'},
        {src:'media/pixel-frontier-cinematic.mp4',poster:'media/pixel-frontier-cinematic.webp',title:'마지막 빛 · 30초 시네마틱',caption:'VARCO 3D 생성 모델을 Blender에서 연출한 홍보 시네마틱 · 게임 플레이 화면 아님 · 30초 · 소리 있음'}
      ]
    },
    {
      id:'greed-armor',title:'GREED ARMOR',subtitle:'적의 갑옷을 벗겨 오른팔에 쌓아 올리는 부품 누적형 3D 액션.',
      engine:'Unity 6 · HDRP · C#',category:'액션',status:'개발 중 · Windows 시연 빌드 실행 기록',year:'2026',period:'2026.10.29 – 11.05',featured:true,
      tools:['Unity 6 HDRP','VARCO 3D 생성 에셋','Mixamo 원본 동작','Blender'],
      description:'쓰러뜨린 적이 입고 있던 갑옷 부품이 하나씩 날아와 오른팔에 붙고, 팔이 길고 무거워질수록 공격과 방어가 강해지는 3D 액션입니다. 194×210m 거신 도시 필드(일반몹 32·지역 보스 4)와, 일반몹 3마리 → 봉인문 → 8m 거대 보스로 이어지는 집중 시연판 두 모드가 있습니다. 시연판 Windows 빌드를 타이틀부터 종료까지 실제 마우스로 실행한 기록이 있으며, 회수 연출과 카메라는 아직 다듬는 중입니다.',
      features:['처치한 적의 착용 부품이 오른팔에 누적되는 성장','부품 등급·중량·과적과 E 회전 공격·F 내려치기 해금','Mixamo 원본 클립 기반 근접 판정과 8m 거대 보스','움직이는 타이틀·4쪽 튜토리얼·부품 작업대·저장과 이어하기'],
      history:['10.29–10.30 · 모듈형 도자기 갑옷 20파츠와 단일 아레나 전투(ArmorCombat), 독립 실행 빌드로 성능 측정','10.30 · URP에서 HDRP로 전환','11.02 · 4보스 거신 도시 필드 Windows 빌드','11.05 · 성장 팔·봉인문·거대 보스 시연판 후보 빌드(최종 미승인)'],
      images:[
        {src:'media/greed-attack.webp',alt:'GREED ARMOR 거신 도시 시작 구역에서 공격하는 플레이어',caption:'Windows 시연 빌드 실제 실행 화면 · 공격과 최소 HUD (프로젝트 내 기존 캡처)'},
        {src:'media/greed-title.webp',alt:'GREED ARMOR 타이틀 메뉴',caption:'Windows 시연 빌드 실제 실행 화면 · 타이틀'},
        {src:'media/greed-gate.webp',alt:'부품 61개가 붙은 긴 오른팔로 봉인문 앞에 선 플레이어',caption:'에디터 플레이 · 부품 61개 팔로 봉인문 앞에 선 장면 (검증 실행 캡처)'},
        {src:'media/greed-boss.webp',alt:'8m 거대 보스가 공격하는 장면',caption:'에디터 플레이 · 8m 거대 보스의 공격 순간 (검증 실행 캡처)'},
        {src:'media/greed-workbench.webp',alt:'부품 작업대와 81개 부품을 붙인 오른팔',caption:'에디터 플레이 · 부품 작업대 UI (검증용 상태 배치 포함)'},
        {src:'media/greed-city.webp',alt:'계단식 거신 도시와 거대한 흉상',caption:'에디터 게임 뷰 · 거신 도시 필드 (11.02 버전 HUD)'},
        {src:'media/greed-early-absorb.webp',alt:'초기 아레나에서 승리 후 부품을 흡수한 캐릭터',caption:'초기 버전(10.30) · 독립 실행 성능 측정 빌드의 승리 후 부품 흡수 화면'},
        {src:'media/last-combat.webp',alt:'초기 아레나의 두 전투 캐릭터',caption:'초기 버전 · 단일 아레나 전투 씬 실시간 엔진 캡처'},
        {src:'media/last-armor.webp',alt:'도자기 전신 갑옷',caption:'초기 버전 · 갑옷 아트 검토용 실시간 엔진 캡처'}
      ],
      videos:[{src:'media/greed-absorb-legacy.mp4',poster:'media/greed-early-absorb.webp',title:'초기 버전 · 부품 흡수',caption:'10.30 초기 버전 · 실제 Unity 프레임 234장을 이어 만든 7.8초 영상 · 실시간 녹화 아님 · 무음'}]
    },
    {
      id:'alkkagi',title:'LUCKY FLICK SURVIVOR',subtitle:'알까기 생존 액션. 한 번의 조준으로 뒤집는 전장.',
      engine:'Unity 6 · C#',category:'액션',status:'Windows 빌드 · 직접 실행 확인',year:'2026',featured:true,
      description:'돌을 드래그해 방향과 힘을 정하고 충돌로 적을 제거하는 알까기형 생존 액션. 초기 개발 발표 자료와 현재 Lucky Flick Survivor 빌드를 함께 기록했습니다. 빌드에서 직접 발사·적 처치·레벨업 선택까지 확인했습니다.',
      features:['드래그 조준·발사·충돌 전투','적 누적과 생존 목표','레벨업 3택 성장','회전 검·감속 저항·화살 발사'],
      history:['1주차 · 돌 배치·조준·성장 선택 프로토타입(발표 자료)','Lucky Flick Survivor · 캐릭터 돌과 생존 목표를 갖춘 Windows 빌드','2026.10.24 · 실패 조건 없는 퍼즐 로그라이크 변형(v0.3) 소스 실험 · 실행 미확인'],
      images:[{src:'media/lucky-play.webp',alt:'Lucky Flick Survivor 알까기 실제 플레이 화면',caption:'직접 실행 캡처 · Windows 빌드 · 알까기 플레이'},{src:'media/lucky-title.webp',alt:'Lucky Flick Survivor 타이틀',caption:'직접 실행 캡처 · 타이틀'},{src:'media/lucky-growth.webp',alt:'알까기 적 처치 후 세 가지 성장 선택',caption:'직접 실행 캡처 · 레벨업 선택'},{src:'media/alkkagi-aim.webp',alt:'알까기 초기 조준 방향 표시',caption:'1주차 개발 발표 자료의 게임 화면 · 초기 조준'},{src:'media/alkkagi-growth.webp',alt:'알까기 초기 능력 선택 화면',caption:'1주차 개발 발표 자료 · 초기 성장 선택'},{src:'media/alkkagi-end.webp',alt:'알까기 초기 게임오버 화면',caption:'1주차 개발 발표 자료 · 초기 게임오버'}],
      videos:[{src:'media/lucky-play.mp4',poster:'media/lucky-play.webp',title:'알까기 · 직접 플레이 녹화',caption:'Windows 빌드 직접 조작 · 드래그 발사 → 적 처치 → 레벨업 선택 · 14초 · 무음'}]
    },
    {
      id:'team-rpg',title:'3분',subtitle:'3분 뒤 세상이 불탄다. 죽어도 다시, 시간을 되돌려라.',
      engine:'Unity 6 · URP · C#',category:'RPG',status:'Windows 빌드 · 실제 플레이 녹화',year:'2026',team:'팀 프로젝트 · 우당탕',role:'그래픽 · 컨셉아트 · 프로토타입 제작',featured:true,
      tools:['Unity 6 URP','VARCO 3D','Blender'],
      description:'화룡 이그니스가 3분 뒤 세상을 불태우겠다고 선언하자, 시간의 신이 주인공에게 시간회귀 능력을 주며 시작하는 쿼터뷰 3D 액션 RPG입니다. 3분 안에 아이템 3개와 동료 2명을 모아 화룡을 쓰러뜨려야 하며, 죽거나 시간이 다 되면 처음으로 돌아가 다시 도전합니다. 팀 우당탕의 프로젝트로, Windows 빌드 플레이 녹화와 33초 편집 프로모를 함께 실었습니다.',
      features:['3분 제한과 시간회귀 루프 · 시계 HUD','신의 능력 뽑기 연출과 동료 영입(사냥꾼 로완 기절 화살)','방패·대장장이 브룬 강화·발판 퍼즐·대시로 절벽 건너기','화룡 이그니스(HP 3000) · 브레스·용암 바닥·분노 단계'],
      images:[
        {src:'media/threemin-boss.webp',alt:'화룡 이그니스와 싸우는 용암 전장',caption:'실제 플레이 녹화 프레임 · 화룡 이그니스 전투'},
        {src:'media/threemin-title.webp',alt:'3분 타이틀 메뉴',caption:'실제 플레이 녹화 프레임 · 타이틀'},
        {src:'media/threemin-companion.webp',alt:'사냥꾼 로완과 대화',caption:'실제 플레이 녹화 프레임 · 동료 사냥꾼 로완'},
        {src:'media/threemin-puzzle.webp',alt:'빛나는 순서대로 밟는 발판 퍼즐',caption:'실제 플레이 녹화 프레임 · 발판 퍼즐'},
        {src:'media/threemin-forge.webp',alt:'대장장이 브룬의 대장간',caption:'실제 플레이 녹화 프레임 · 대장장이 브룬 강화'},
        {src:'media/threemin-boss-arena.webp',alt:'화룡 이그니스 등장',caption:'실제 플레이 녹화 프레임 · 화룡 이그니스 등장'},
        {src:'media/threemin-clear.webp',alt:'CLEAR 화면',caption:'실제 플레이 녹화 프레임 · 클리어'}
      ],
      videos:[{src:'media/threemin-promo.mp4',poster:'media/threemin-title.webp',title:'3분 · 33초 프로모',caption:'실제 플레이 녹화를 편집한 33초 프로모 · 자체 작곡 BGM · 소리 있음'}]
    },
    {
      id:'rift-manager',title:'RIFT MANAGER',subtitle:'팀을 설계하고, 전장을 지배하다.',
      engine:'Unity 6 · C#',category:'시뮬레이션',status:'Windows 빌드',year:'2026',featured:true,
      description:'영웅 조합과 드래프트로 전장을 설계하는 5 대 5 자동 공성 게임. 낙하한 자 — Arena of Fate 이후 확장한 프로젝트입니다.',
      features:['100명 영웅과 400개 스킬','드래프트와 19종 증강','포탑·본진 공성 및 10인 전투 로스터','초대코드 기반 1 대 1 대전'],
      images:[{src:'media/rift-gameplay.webp',alt:'RIFT MANAGER 전장과 팀 로스터',caption:'실제 게임 캡처 · 공성 전투 HUD'},{src:'media/rift-title.webp',alt:'RIFT MANAGER 시작 화면',caption:'실제 게임 캡처 · 50명 로스터 시기의 초기 타이틀'}],
      videos:[{src:'media/rift-battle.mp4',poster:'media/rift-gameplay.webp',title:'100명 로스터 · 자동전투',caption:'개발 검증용 자동전투 GIF를 MP4로 변환한 영상 · 약 7초'}]
    },
    {
      id:'lumi',title:'LUMI',subtitle:'먹고, 사냥하고, 진화하라. 숲 속 작은 생명체의 성장기.',
      engine:'Unity 6 · URP 2D · C#',category:'액션',status:'Windows 빌드 · 직접 실행 확인 · 첫 목표 범위',year:'2026',period:'2026.11.09',
      tools:['Unity 6 URP 2D','VARCO 3D·Blender(3D 버전 캐릭터)'],
      description:'작은 생명체 루미가 숲을 탐험하며 먹이를 먹고 사냥하고 포식자와 싸워 경험치를 쌓는 생존·진화 액션 프로토타입입니다. 3인칭 3D 버전으로 먼저 만들었다가, 같은 날 3/4 탑다운 고밀도 픽셀 아트 2D 버전으로 다시 만들었습니다. 2D 버전은 Lv10에서 세 갈래 진화를 고를 수 있으며, 진화 후 외형·저장은 아직 없습니다.',
      features:['8방향 이동·달리기·회피 구르기 · 마우스 조준 공격과 발광 펄스','열매·버섯·고기 먹이와 딱정벌레 사냥 · 랩터 추격과 전투','Lv10 성향별 3갈래 진화(송곳니·잎사귀·별빛)','2D 낮·밤 조명과 발광 레이어 · 바람·폭포 셰이더 · 미니맵 HUD'],
      history:['11.09 오전 · 3인칭 3D 버전 v0.1.0(원시 숲, Lv30까지 성장, 진화 선택 미구현)','11.09 오후 · 탑다운 픽셀 아트 2D 버전으로 재제작'],
      images:[
        {src:'media/lumi-raptor.webp',alt:'고사리 숲에서 랩터와 싸우는 루미',caption:'2D 버전 · 프로젝트 내 기존 캡처 · 랩터와 근접전'},
        {src:'media/lumi-start.webp',alt:'시작 공터와 HUD',caption:'2D 버전 · 프로젝트 내 기존 캡처 · 시작 공터와 HUD'},
        {src:'media/lumi-night.webp',alt:'밤의 발광 열매',caption:'2D 버전 · 프로젝트 내 기존 캡처 · 밤과 발광 조명'},
        {src:'media/lumi-evolution.webp',alt:'Lv10 진화 후보 3종',caption:'2D 버전 · 프로젝트 내 기존 캡처 · 진화 화면'},
        {src:'media/lumi3d-forest.webp',alt:'3D 버전 숲길의 루미',caption:'3D 버전 · 직접 실행 캡처 · 시작 숲길과 HUD'},
        {src:'media/lumi3d-evolution.webp',alt:'3D 버전 진화 화면',caption:'3D 버전 · 직접 실행 캡처 · 진화 후보(연구 중 표시)'}
      ],
      videos:[
        {src:'media/lumi-smoke.mp4',poster:'media/lumi-start.webp',title:'LUMI 2D · 자동 테스트 주행',caption:'2D 빌드 직접 실행 녹화 · 내장 자동 테스트가 조작 · 순간 배치 컷 포함 · 14초 · 무음'},
        {src:'media/lumi3d-explore.mp4',poster:'media/lumi3d-forest.webp',title:'LUMI 3D · 숲 탐험',caption:'3D 빌드 직접 플레이 · 걷기 → 질주 → 폭포 방향 이동 · 14초 · 무음'}
      ]
    },
    {
      id:'last-verdict',title:'FINAL VERDICT',subtitle:'최후의 평결 · 일하고, 의심하고, 살아남는다.',
      engine:'Unity 6 · HDRP · Netcode',category:'추리',status:'Windows 빌드 · 실제 플레이 녹화',year:'2026',team:'팀 프로젝트 · 우당탕',role:'그래픽 · 컨셉아트 · 프로토타입 제작',
      description:'저택에 모인 참가자들이 일해서 돈을 벌고 배고픔·화장실·졸림 같은 생존 욕구를 관리하는 1인칭 멀티플레이 추리 게임입니다. 탈출권 구매, 무기 배송, 시신 신고와 재판 투표가 경쟁과 의심을 만듭니다. 최신 빌드는 방 목록과 UDP 직접 접속을 사용하며, 대기실은 4~10명과 봇 추가를 지원합니다.',
      features:['참가 서약 대기실 · 방 목록·로컬 호스트 · 봇 추가','작업 제안과 수입 순위 · 탈출권 구매와 탈출','칼·총 내 방 서랍 배송 · 시신 신고와 재판 투표','배고픔·화장실·졸림 욕구 · 근접 음성 · 유령 관전과 리플레이'],
      images:[
        {src:'media/verdict-hallway.webp',alt:'붉은 벽지 저택 복도와 벽 TV 타이머',caption:'실제 플레이 녹화 프레임 · 저택 복도'},
        {src:'media/verdict-title.webp',alt:'FINAL VERDICT 참가자 단말 타이틀',caption:'실제 플레이 녹화 프레임 · 참가자 전용 단말 타이틀'},
        {src:'media/verdict-lobby.webp',alt:'대기실의 봇과 참가 서약 서명',caption:'실제 플레이 녹화 프레임 · 대기실과 참가 서약'},
        {src:'media/verdict-room.webp',alt:'1인칭 개인 방과 욕구 HUD',caption:'실제 플레이 녹화 프레임 · 개인 방과 욕구 HUD'},
        {src:'media/last-verdict.webp',alt:'이전 빌드의 1인칭 시설과 상태 HUD',caption:'이전 빌드 실제 게임 캡처 · 시설 탐색'}
      ],
      videos:[{src:'media/verdict-hallway.mp4',poster:'media/verdict-room.webp',title:'FINAL VERDICT · 방에서 복도로',caption:'실제 플레이 녹화 발췌 · 개인 방에서 저택 복도로 이동 · 14초 · 무음'}]
    },
    {
      id:'mukbot',title:'먹봇',subtitle:'MUKBOT OVERCONSUMPTION · 불시착한 로봇들, 그중 하나가 에너지를 훔쳐 먹는다.',
      engine:'Unity 6 · URP · Netcode',category:'추리',status:'Windows 빌드 · 실제 멀티플레이 녹화',year:'2026',team:'팀 프로젝트 · 우당탕',role:'그래픽 · 컨셉아트 · 프로토타입 제작',
      tools:['Unity 6 URP','Netcode for GameObjects','VARCO 3D 로봇 모델'],
      description:'붉은 행성에 불시착한 로봇들이 낮에는 에너지 셀을 모아 납품하고 배터리를 충전하는 동안, 숨어 있는 먹봇이 다른 로봇의 에너지를 빼앗는 소셜 디덕션 게임입니다. 밤에는 충전소 리포트와 토론, 투표로 먹봇을 찾아 추방합니다. 정글의 마지막 식량을 이어서 만든 최종 버전으로, 팀 우당탕이 완성했으며 실제 멀티플레이 녹화에서 장면을 가져왔습니다.',
      features:['낮 → 리포트 → 토론 → 투표 페이즈 진행','셀 수집·운반·할당량 납품과 배터리 충전 · 0이면 셧다운','먹봇의 에너지 강탈과 붉은 LED·저전력 경고음 단서','LAN·전용 서버 접속 · 셧다운 후 유령 관전 · 판 기록과 리플레이'],
      history:['정글의 마지막 식량 · 공용 식량·허기·과식 스파이를 다룬 6인 정글 생존 원형','먹봇 · 로봇·에너지 테마로 바꾼 최종 버전(셀·배터리·에너지 강탈)'],
      images:[
        {src:'media/mukbot-day1.webp',alt:'고리 행성 하늘 아래 1일차 시작과 배터리 HUD',caption:'실제 플레이 녹화 프레임 · 1일차 시작'},
        {src:'media/mukbot-collect.webp',alt:'수집 지점에서 셀을 모으는 장면',caption:'실제 플레이 녹화 프레임 · 셀 수집'},
        {src:'media/mukbot-charge.webp',alt:'충전소에서 배터리 충전',caption:'실제 플레이 녹화 프레임 · 충전소 충전 +25'},
        {src:'media/mukbot-ghost.webp',alt:'셧다운 후 유령 시점의 항공 뷰',caption:'실제 플레이 녹화 프레임 · 셧다운 후 유령 자유 비행'}
      ],
      videos:[{src:'media/mukbot-play.mp4',poster:'media/mukbot-charge.webp',title:'먹봇 · 납품과 충전',caption:'실제 멀티플레이 녹화 발췌 · 충전소 납품과 충전 · 14초 · 무음'}]
    },
    {
      id:'wall-breaker',title:'벽 · 참',subtitle:'WALL BREAKER · 작업표시줄 위에서 떨어지는 벽을 베는 데스크톱 자동전투.',
      engine:'Unity 6 · C# · Win32',category:'캐주얼',status:'Windows 빌드 V17 · 직접 실행 확인',year:'2026',period:'2026.10.10 – 10.11',
      description:'Windows 작업표시줄 바로 위에 투명한 띠 창을 띄우고, 그 안에서 검사가 떨어지는 벽을 자동으로 베고 막고 필살기로 튕겨 올립니다. 벽을 부숴 얻은 토큰으로 6개 능력을 영구 강화하고, 실제 PC의 RAM·CPU 사용률을 1초마다 측정해 일시적인 공명 전투 보너스로 반영합니다. V1부터 V17까지 이틀 동안 반복 개선했습니다.',
      features:['테두리 없는 투명 오버레이 창 · 작업 영역 하단 도킹과 드래그','RAM·CPU 사용률 연동 공명 보너스(최대 5배)','일반 벽 25개마다 보스 벽 · 처치 횟수로 검 스킨 4종 해금','6종 영구 강화 · 공격형/반격형 스타일 · Lv.5 기술 해금'],
      history:['V1 · 자동 공격·방어·필살기','V4 · 잉크 외곽선 벡터 아트로 전면 리디자인','V6 · 효과음','V13 · 전투 스타일과 특수 벽','V14 · 보스 벽과 검 외형','V17 · CPU 공명'],
      images:[
        {src:'media/wall-breaker-upgrade.webp',alt:'강화 창과 보스 벽 전투',caption:'직접 실행 캡처 · V17 · 강화 창과 보스 벽 · 투명 영역은 검정으로 표시'},
        {src:'media/wall-breaker-arc.webp',alt:'낙하 벽을 베어 올리는 검사',caption:'직접 실행 캡처 · 낙하 벽 베어 올리기'},
        {src:'media/wall-breaker-ultimate.webp',alt:'필살기 일섬 수직 베기',caption:'직접 실행 캡처 · 필살기 일섬'},
        {src:'media/wall-breaker-skins.webp',alt:'검 보관함의 검 스킨 4종',caption:'직접 실행 캡처 · 검 보관함'}
      ],
      videos:[{src:'media/wall-breaker-play.mp4',poster:'media/wall-breaker-arc.webp',title:'벽 · 참 · 직접 실행 녹화',caption:'V17 Windows 빌드 직접 실행 · 자동 전투·벽 격파·필살기 · 14초 · 무음'}]
    },
    {
      id:'snow-leopard-companion',title:'설표 컴패니언',subtitle:'SNOW LEOPARD COMPANION · 작업표시줄 위를 걷는 3D 데스크톱 친구.',
      engine:'Unity 6 · URP · Win32',category:'실험',status:'Windows 빌드 · 직접 실행 확인',year:'2026',period:'2026.10.09 – 10.10',
      tools:['Unity 6 URP','VARCO 3D 생성 모델','Blender 직접 리깅·애니메이션'],
      description:'투명한 창으로 데스크톱 작업표시줄 위를 걸어 다니는 3D 아기 설표 컴패니언입니다. 화면 끝에서 140도 회전으로 방향을 바꾸고 달리기·점프·꼬리 잡기 놀이를 하며, 클릭하면 말풍선 카드에서 AI 대화와 폴더 작업 요청을 할 수 있습니다. 게임보다는 데스크톱 펫·인터랙티브 앱 실험이며, VARCO 3D 모델에 26본 리그와 동작을 Blender로 직접 만들었습니다.',
      features:['항상 위에 뜨는 투명 창 · 드래그 후 작업표시줄로 낙하','26본 리그 · 걷기·140도 회전·달리기·점프·꼬리 놀이','Codex 연결 AI 대화 말풍선','요청마다 승인하는 작업 폴더 기반 파일 작업'],
      images:[
        {src:'media/snow-leopard-walk.webp',alt:'정면으로 걷는 설표',caption:'직접 실행 캡처 · 정면 걷기 · 투명 영역은 검정으로 표시'},
        {src:'media/snow-leopard-tail.webp',alt:'꼬리 잡기 놀이 중인 설표',caption:'직접 실행 캡처 · 꼬리 잡기 놀이'},
        {src:'media/snow-leopard-run.webp',alt:'달리는 설표',caption:'직접 실행 캡처 · 달리기'},
        {src:'media/snow-leopard-chat.webp',alt:'설표 대화 카드 UI',caption:'Unity 에디터 플레이 화면 · 대화 카드(마젠타는 투명 처리 전 컬러키)'}
      ],
      videos:[{src:'media/snow-leopard-desktop.mp4',poster:'media/snow-leopard-walk.webp',title:'설표 컴패니언 · 데스크톱',caption:'Windows 빌드 직접 실행 · 걷기 → 꼬리 놀이 → 회전 · 14.5초 · 무음'}]
    },
    {
      id:'star-guardian',title:'숲의 수호자',subtitle:'STAR GUARDIAN · 별을 쏘는 햄스터, 세 보스를 넘어 폐허 마을을 지켜라.',
      engine:'Unity 6 · URP · C#',category:'액션',status:'WebGL·Windows 빌드 · WebGL 직접 실행 확인',year:'2026',period:'2026.09.19 – 09.20',
      tools:['Unity 6 URP','VARCO 3D 생성 캐릭터·몬스터·맵','Blender'],
      description:'파자마 햄스터를 조종해 폐허 마을로 몰려오는 몬스터를 마우스 조준 별탄으로 막는 3인칭 웨이브 생존 슈터입니다. 레벨업마다 9종 축복 중 3개를 제시하고, 5·10·15웨이브에 예티·타락한 고목·용암 드래곤 보스가 등장합니다. WebGL 빌드에서 이동·사격·처치·레벨업을 직접 확인했으며, 보스 장면은 에디터 자동 검증 캡처입니다.',
      features:['WASD 이동·점프와 마우스 지점 조준 별탄 사격','레벨업 3택 1 축복 9종(다중탄·관통·별 수호자·유성 등)','5·10·15웨이브 보스 캠페인 · 드래곤 비행·유성·브레스','VARCO 3D 생성 에셋과 런타임 NavMesh 폐허 맵'],
      images:[
        {src:'media/star-guardian-combat.webp',alt:'폐허 마을 광장에서 몬스터와 교전',caption:'직접 실행 캡처 · WebGL 빌드 · 몬스터와 교전'},
        {src:'media/star-guardian-shooting.webp',alt:'별탄 사격과 몰려오는 몬스터',caption:'직접 실행 캡처 · WebGL 빌드 · 별탄 사격'},
        {src:'media/star-guardian-levelup.webp',alt:'레벨 3 숲의 축복 선택',caption:'직접 실행 캡처 · WebGL 빌드 · 레벨업 축복 선택'},
        {src:'media/star-guardian-dragon.webp',alt:'용암 드래곤 비행 보스',caption:'에디터 자동 검증 캡처 · 15웨이브 용암 드래곤 · 무적·시간 가속 사용'},
        {src:'media/star-guardian-yeti.webp',alt:'빙하의 예티 보스와 예고 장판',caption:'에디터 자동 검증 캡처 · 5웨이브 빙하의 예티'},
        {src:'media/star-guardian-clear.webp',alt:'보스 3종 처치 후 CLEAR',caption:'에디터 자동 검증 캡처 · 캠페인 클리어 화면'}
      ],
      videos:[{src:'media/star-guardian-play.mp4',poster:'media/star-guardian-combat.webp',title:'숲의 수호자 · 직접 플레이',caption:'WebGL 빌드 직접 플레이 · 이동·조준 사격·처치 → 레벨업 · 11.7초 · 무음'}]
    },
    {
      id:'adrift',title:'ADRIFT',subtitle:'CREW SURVIVAL · 가라앉는 작은 배, 여덟 명이 손으로 물을 퍼내라.',
      engine:'Unreal Engine 5.8 · C++',category:'캐주얼',status:'협동 프로토타입 · 에디터 플레이 · 패키징 빌드 없음',year:'2026',period:'2026.10.05',
      tools:['Unreal Engine 5.8 Water','VARCO 3D 생성 배·재료·손 모델'],
      description:'최대 8명이 1인칭으로 작은 배에 타서 구멍으로 차오르는 물을 손으로 떠서 바다에 버리는 협동 프로토타입입니다. 파도에 떠밀려 오는 판자·못 상자·망치를 주워 구멍 세 곳을 막으면 성공하고, 침수가 100%에 이르면 실패합니다. 서버 권한 판정과 LAN/IP 접속을 구현했고 8개 클라이언트 동기화를 로그로 확인했습니다.',
      details:[
        {title:'게임 흐름',text:'최대 8명이 1인칭으로 길이 약 4.6m, 폭 약 2.4m의 작은 배에 함께 타는 협동 생존 프로토타입입니다. 첫 플레이어가 들어오면 침수가 시작되고, 구멍으로 차오르는 물을 손으로 퍼내면서 파도에 떠밀려 오는 재료로 구멍 세 곳을 막아야 합니다. 구멍 3개를 모두 수리하고 손에 담은 물까지 버리면 \'BOAT SAVED - GREAT TEAMWORK!\', 침수가 100%에 이르면 \'THE BOAT FLOODED - TRY AGAIN\'이 뜹니다.'},
        {title:'조작과 규칙',text:'WASD와 마우스로 움직이고, 배 안의 물을 보며 왼쪽 클릭하면 손으로 물을 담고, 난간 밖 바다를 보며 다시 클릭하면 버립니다. 떠내려오는 판자·못 상자·망치는 조준한 뒤 2.55m 안에서 F로 줍고, 구멍의 \'LEAK [E]\' 표시에서 E를 눌러 수리합니다. 수리 1회에는 판자 3개와 못 상자 1개가 들고, 망치는 있어야 하지만 소모되지 않습니다. I는 개인 인벤토리, Space는 점프, Enter는 채팅입니다.'},
        {title:'서버 권한 판정',text:'침수량, 수리 횟수, 재료 수, 승패는 모두 서버가 판정해 클라이언트에 복제합니다. 줍기도 서버가 거리·조준·대기시간·라운드 상태를 확인한 뒤 처리하며, 재료는 처음 12초 뒤부터 21초 간격으로 떠내려옵니다. 왼쪽 위 HUD에는 \'WATER %\'와 \'PATCHES n / 3\', 침수 막대가 표시되고, 침수가 70%를 넘으면 막대가 붉게 바뀝니다.'},
        {title:'배와 바다 표현',text:'배의 상하 운동과 피치·롤은 서버 시간을 기준으로 계산해 모든 플레이어가 같은 흔들림을 보고, 1인칭 카메라도 함께 흔들립니다. 바다는 Epic Water 플러그인의 수면 재질을 바탕으로 만든 머티리얼과 HDR 하늘로 표현했습니다. 물리 유체 시뮬레이션이 아니라, 움직이는 수면 노멀과 배 운동을 맞춰 파도를 보여 줍니다. 배·판자·못 상자·망치·손 모델은 VARCO로 생성했고, 손은 대기 자세와 물 뜨는 자세 두 메시 사이를 보간해 움직입니다.'},
        {title:'멀티플레이와 채팅',text:'최대 8명까지 접속하며, 그 이상은 \'Boat is full (8 players maximum)\'으로 거절하도록 만들었습니다. 자기 몸은 숨기고 다른 플레이어에게만 보이게 했으며, 손은 본인에게만 보입니다. Enter로 채팅하면 서버가 메시지를 120자로 자르고 1초에 1개로 제한한 뒤, 보낸 사람의 머리 위에 5초 동안 말풍선으로 띄웁니다. 다른 플레이어의 몸은 엔진 기본 마네킹을 임시로 쓰고 있고, 접속은 LAN 호스트·참가용 실행 파일로 IP를 입력하는 방식입니다.'},
        {title:'검증과 남은 범위',text:'C++ 에디터 빌드와 자동 테스트(MultiGame.Boat.AuthorityRules)가 통과했으며, 이 테스트는 물 퍼내기, 연속 입력 제한, 배 밖 동작 차단, 재료 조건·소모, 줍기, 채팅을 확인합니다. 별도 서버에 클라이언트 8개를 붙인 검사에서는 서버 시간 60초 시점에 모든 클라이언트의 인원(8명)과 침수량이 일치했습니다. 그 뒤에 추가한 채팅·전신 캐릭터 버전은 8인으로 다시 검증하지 않았고, 9번째 접속 거절도 실행으로 확인하지 못했습니다. 인터넷 매치메이킹·초대·NAT 연결과 패키징 빌드는 아직 구현하지 않았습니다.'}
      ],
      features:['침수량·수리·승패를 서버가 판정하고 복제','손을 모아 물을 담고 난간 밖으로 버리는 퍼내기','판자 3·못 상자 1·망치로 구멍 수리 · 인벤토리','최대 8인 접속 · 머리 위 채팅 말풍선 · 파도에 흔들리는 배'],
      images:[
        {src:'media/adrift-deck.webp',alt:'물이 찬 배 안과 1인칭 손',caption:'에디터 플레이(PIE) 화면 · 물이 찬 갑판 · 프로젝트 내 기존 캡처'},
        {src:'media/adrift-scoop.webp',alt:'손을 모아 물을 뜨는 자세',caption:'에디터 플레이(PIE) 화면 · 물 뜨는 손 자세'},
        {src:'media/adrift-ocean.webp',alt:'HDR 하늘과 바다',caption:'에디터 플레이(PIE) 화면 · 하늘과 바다'},
        {src:'media/adrift-editor.webp',alt:'언리얼 에디터 뷰포트의 배와 바다',caption:'언리얼 에디터 뷰포트 · 플레이 화면 아님'}
      ],
      videos:[]
    },
    {
      id:'tom-and-jerry',title:'성림 마을',subtitle:'장산범 둘, 삼미호 여덟. 성림 마을의 추격 프로토타입.',
      engine:'Unreal Engine 5.8 · C++',category:'액션',status:'비대칭 멀티플레이 프로토타입 · 공격·승패 미구현',year:'2026',period:'2026.10.08',
      tools:['Unreal Engine 5.8','VARCO 3D 생성 캐릭터','Blender 마을 레이아웃'],
      description:'조선풍 성곽 마을 성림에서 장산범(최대 2명)이 삼미호(최대 8명)를 쫓는 3인칭 비대칭 멀티플레이 프로토타입입니다. 삼미호는 길을 막는 여우구슬을 설치하고 여우불로 추격자를 느리게 만듭니다. 진영 선택과 능력 복제까지 구현했으며, 공격·승패·온라인 매칭은 아직 없습니다. 내부 프로젝트명은 TomAndJerry입니다.',
      details:[
        {title:'게임 개요',text:'조선풍 성곽 마을 \'성림\'에서 장산범(최대 2명)이 삼미호(최대 8명)를 쫓는 3인칭 비대칭 추격 프로토타입입니다. 1을 누르면 삼미호, 2를 누르면 장산범 진영을 고르며, 진영을 바꾸면 그 진영의 시작 지점에서 다시 생성됩니다. 진영이 가득 차면 선택을 막고, 마을 정원 10명을 넘는 접속은 거절합니다. 조작은 WASD 이동, Shift 달리기, Space 점프, 마우스 시점, 휠 카메라 거리입니다.'},
        {title:'여우구슬',text:'삼미호는 E로 자기 앞 4.5m 지점에 여우구슬을 설치해 길을 막습니다. 마나와 쿨타임은 없고, 플레이어마다 동시에 4개까지 둘 수 있으며 각 구슬은 60초 뒤 사라집니다. 구슬은 삼미호와 장산범을 모두 막고, 구슬끼리 또는 건물·성문 연결벽과 겹쳐 설치할 수 있지만 캐릭터가 있는 자리에는 생기지 않습니다. 2인 PIE에서 4개 연속 설치, 5번째 차단, 60초 소멸, 재설치, 양 진영 충돌, 복제까지 8개 검사를 통과했습니다.'},
        {title:'여우불',text:'삼미호마다 여우불 6개가 등 뒤에 위·가운데·아래로 두 개씩 떠 있습니다. 5m 안에서 시야가 닿는 장산범이 있으면 초속 24m로 날아가 맞히고, 피해 없이 5초 동안 이동 속도를 10%로 떨어뜨립니다. 다시 맞아도 감속이 겹치지 않고 지속시간만 갱신되며, 터진 여우불은 30초 뒤 다시 생깁니다. 명중하면 푸른 불덩이 폭발과 불꽃 줄기 7개, 충격파, 불티 12개가 1.35초 동안 퍼지는 연출이 나옵니다.'},
        {title:'캐릭터와 애니메이션',text:'캐릭터는 VARCO로 생성했고, 정면·좌·우·후면 네 방향 이미지를 Multiview 입력으로 쓰는 것을 원칙으로 했습니다. 삼미호는 VARCO 사족보행 리그를 쓰고, 꼬리 3개가 공통 꼬리 체인으로 움직입니다. 장산범은 VARCO 자동 리깅이 실패해 Blender로 맞춤 골격을 만들고 VARCO 고양이 동작을 입혔습니다. 두 캐릭터 모두 속도에 따라 대기·걷기·달리기 동작이 블렌딩됩니다.'},
        {title:'성림 마을',text:'마을은 Blender에서 성벽·지형·길·농경지를 구성하고, VARCO로 생성한 한옥·성문루·곳간·정자·사당·우물·옹기·장터 좌판·느티나무 등 16종 모델을 배치했습니다. 약 600m 크기의 마을에 주거 건물 168채, 모델 인스턴스 2,286개가 들어가며 배경 지형은 2,300 × 2,300m입니다. 언리얼로 옮긴 뒤에는 성문 연결벽, 지면 접지, 식생 등을 버전별 수정 기록을 남기며 다듬어 검수 맵(L_SeongrimVillage_Reviewed)을 만들었습니다.'},
        {title:'확인 범위',text:'C++ 모듈 빌드, 실제 런타임의 이동·지면 충돌·진영 전환, 여우구슬과 여우불의 2인 PIE 동작은 확인했습니다. 공격·피해·승패와 로비·온라인 매칭은 아직 구현하지 않았고, 10인 접속 부하와 인터넷 연결, 패키징은 검증하지 않았습니다. 장산범의 점프 높이를 두 배로 늘린 변경(초기 속도 480√2)도 실측 플레이로 확인하지 못했습니다. 내부 프로젝트명은 TomAndJerry입니다.'}
      ],
      features:['삼미호(최대 8)·장산범(최대 2) 진영 선택과 정원 10명','여우구슬 설치 · 1인 최대 4개 · 60초 유지','여우불 · 5m 안 장산범 추적 후 5초 감속','VARCO 3D 캐릭터 리깅 · 대기·걷기·달리기 블렌드'],
      images:[
        {src:'media/seongrim-foxfire.webp',alt:'여우불 6개를 두른 삼미호',caption:'엔진 실행 화면 · 삼미호와 여우불 (프로젝트 내 기존 캡처)'},
        {src:'media/seongrim-burst.webp',alt:'여우불이 장산범에게 맞아 터지는 장면',caption:'엔진 실행 화면 · 여우불 명중 연출'},
        {src:'media/seongrim-gate.webp',alt:'성문을 지나는 장산범과 진영 HUD',caption:'에디터 플레이(PIE) · 성문을 지나는 장산범'},
        {src:'media/tom-jerry.webp',alt:'Unreal 장산범 캐릭터 쇼케이스',caption:'엔진 캐릭터 쇼케이스 · 장산범'},
        {src:'media/seongrim-village-render.webp',alt:'성림 마을 레이아웃 렌더',caption:'Blender 마을 레이아웃 렌더 · 게임 화면 아님'}
      ],
      videos:[]
    },
    {
      id:'star-eleven',title:'STAR ELEVEN',subtitle:'별의 스트라이커. 나만의 축구 커리어.',
      engine:'Unity 6 · C#',category:'스포츠',status:'Windows 빌드',year:'2026',
      description:'11 대 11 자동 축구와 선수 성장, 훈련, 경기 후 평가를 연결한 선수 커리어 게임. 필살기 컷인과 골 리플레이로 경기의 순간을 연출합니다. 구단 운영 게임인 한빛 감독 축구와는 별개의 프로젝트입니다.',
      features:['11 대 11 경기와 선수 체력','훈련·주간 커리어·경제 시스템','스킬 연출과 성장','골 리플레이·세리머니·경기 후 코치 평가'],
      images:[{src:'media/football-match.webp',alt:'STAR ELEVEN 11 대 11 축구 경기',caption:'실제 게임 캡처 · 경기 화면'},{src:'media/football-career.webp',alt:'STAR ELEVEN 선수 커리어 화면',caption:'실제 게임 캡처 · 커리어 메뉴'},{src:'media/football-thunder.webp',alt:'번개와 축구공의 AI 생성 시네마틱 실험',caption:'AI 생성 시네마틱 실험 · 게임 미통합 · 실제 게임 화면 아님'}],
      videos:[{src:'media/football-skill.mp4',poster:'media/football-match.webp',title:'Thunder Shot · 경기 속 스킬 연출',caption:'스킬 컷인에서 경기 복귀까지 · 개발 캡처 GIF를 MP4로 변환'},{src:'media/football-thunder.mp4',poster:'media/football-thunder.webp',title:'시네마틱 실험 · 게임 미통합',caption:'AI 생성 시네마틱의 192프레임 보간 실험 · 60Hz · 실제 플레이 영상 아님'}]
    },
    {
      id:'dungeon',title:'ESCAPE FROM DUNGEON',subtitle:'가져갈 것인가, 살아서 돌아갈 것인가.',
      engine:'Unity 6 · URP 2D',category:'RPG',status:'모바일 세로형 프로젝트',year:'2026',
      description:'세로 화면으로 구성한 턴제 추출 로그라이트. 던전의 전투와 도주, 가방 관리, 캠프의 준비 과정을 연결합니다.',
      details:[
        {title:'게임 흐름',text:'1080 × 2340 세로 화면으로 만든 턴제 추출 로그라이트입니다. 던전에서 싸우거나 도주하고, 가방에 모은 것을 들고 돌아갈지 선택하며, 캠프에서 다음 탐험을 준비하는 과정을 하나로 연결했습니다. 부제 \'가져갈 것인가, 살아서 돌아갈 것인가\'가 이 선택을 가리킵니다.'},
        {title:'전투 화면',text:'남아 있는 캡처는 \'거미의 둥지\' 구역에서 거대 거미(HP 39)와 마주친 장면입니다. 화면 위쪽에 구역 이름과 적 일러스트가 있고, 그 아래에 플레이어의 체력(91/100)과 횃불(77/100) 게이지가 나란히 놓입니다. 적 정보 칸에는 적의 상태로 \'공격 준비\'가 표시됩니다.'},
        {title:'행동 선택',text:'전투 행동은 공격, 방어, 강공격, 도주 네 가지 버튼으로 고릅니다. 도주가 전투 선택지에 들어 있어 싸우지 않고 빠져나가는 것도 하나의 판단이 됩니다. 네 버튼은 철판과 리벳 질감의 큰 카드로 2 × 2 배치되어 있습니다.'},
        {title:'가방과 추출',text:'화면 하단에는 회복 물약 개수(1개), 배낭 칸(6/12), 금화 \'미확보 38 G\'가 표시됩니다. \'미확보\'라는 표기로 던전에서 얻은 금화가 아직 확보되지 않은 상태임을 따로 구분합니다. 던전 밖에는 캠프·상점·제단이 있어 탐험 사이의 준비를 맡습니다.'},
        {title:'확인 범위',text:'이 PC에는 소스와 빌드가 없어, 이전 PC에서 작성한 항목 설명과 실제 게임 캡처 1장을 바탕으로 정리했습니다. 상점·제단의 구체적인 효과, 횃불이 줄어드는 조건, 던전 구성은 확인하지 못해 적지 않았습니다. 모바일 실기기에서의 실행 여부도 확인되지 않았습니다.'}
      ],
      features:['1080 × 2340 세로형 UI','턴제 전투·도주','가방과 추출 선택','캠프·상점·제단'],
      images:[{src:'media/dungeon.webp',alt:'Escape from Dungeon 세로형 턴제 전투 화면',caption:'실제 게임 캡처 · 턴제 전투',pos:'50% 18%'}],videos:[]
    },
    {
      id:'arena-unreal',title:'원형 경기장',subtitle:'한 판 뒤집어. 원형 투기장 멀티플레이.',
      engine:'Unreal Engine 5.8 · C++',category:'액션',status:'대전 프로토타입 · 빌드 있음',year:'2026',
      description:'원형 투기장에서 싸우는 리슨서버 대전 프로토타입. 최대 8인 연결 구조와 9종 캐릭터, 무기 순환, 대시 공격을 구현했습니다.',
      features:['IP 방 만들기·참가','3분 경기·목숨 3개','9종 캐릭터·건틀릿/검/망치','대시 공격·넉다운·가드'],
      images:[{src:'media/arena-unreal.webp',alt:'원형 경기장 Unreal 게임 플레이 화면',caption:'실제 게임 캡처 · 경기장과 캐릭터 HUD'}],
      videos:[{src:'media/arena-promo.mp4',poster:'media/arena-unreal.webp',title:'원형 경기장 · 30초 프로모',caption:'게임 캡처 기반 편집 프로모 영상 · 30초 · 소리 있음'}]
    },
    {
      id:'aurora',title:'AURORA',subtitle:'REMOTE CONTROL. 시설을 탈출하라.',
      engine:'Unity 6 · URP',category:'추리',status:'Windows 빌드',year:'2026',
      description:'4~10인이 참여하는 1인칭 시설 탈출 게임. 6종 직업과 원격 개입 능력을 중심으로 협력과 방해가 교차합니다.',
      details:[
        {title:'게임 개요',text:'연구 시설(AURORA / RESEARCH FACILITY)을 무대로 한 1인칭 시설 탈출 게임입니다. 시작 화면의 문구는 \'믿고, 의심하고, 살아남아라.\'이며, \'지상에는 숨겨진 적이 있다. 전력을 복구하고, 마지막 신뢰의 고리를 완성하라.\'라는 목표가 함께 나옵니다. 4~10인이 참여해 협력과 방해가 엇갈리는 구조입니다.'},
        {title:'역할과 능력',text:'플레이어는 6종 직업 가운데 하나를 맡습니다. 숨어 있는 침입자에게는 원격으로 정전과 해킹을 일으키는 능력이 있습니다. 문 봉쇄와 시설 탈출이 게임의 주요 요소로 기록되어 있습니다.'},
        {title:'시설 설정',text:'시작 화면 오른쪽의 \'시설 상태\' 패널에는 \'격리 프로토콜 활성\'과 \'지상 ↔ 지하 음성 차단\'이 표시됩니다. 시설이 지상과 지하로 나뉘어 있고, 두 구역 사이의 음성이 막힌 상태로 시작합니다. 배경에는 푸른 조명이 들어간 3D 시설 내부가 보입니다.'},
        {title:'방 만들기와 연습',text:'대원 이름을 입력한 뒤 초대코드로 방을 만들거나, 받은 코드를 입력해 참가합니다. \'혼자 연습하기\'를 고르면 봇 5명과 함께 플레이할 수 있습니다. 화면 하단에는 \'6–10 PLAYERS / PRIVATE INVITE / WINDOWS\'와 \'PROTOTYPE 0.1 · TRUST IS THE FINAL KEY\'가 적혀 있습니다.'},
        {title:'확인 범위',text:'이 PC에는 소스와 빌드가 없어, 이전 PC에서 작성한 항목 설명과 시작 화면 캡처 1장(Development Build, 프로토타입 0.1)을 바탕으로 정리했습니다. 캡처 속 초기 프로토타입은 6~10인, 항목 설명은 4~10인으로 서로 다르며 어느 쪽이 최종인지는 확인하지 못했습니다. 6종 직업의 이름과 능력, 승리 조건의 세부 규칙도 확인하지 못해 적지 않았습니다.'}
      ],
      features:['초대코드 방 만들기·참가','6종 직업','침입자의 원격 정전·해킹','문 봉쇄와 시설 탈출'],
      images:[{src:'media/aurora.webp',alt:'AURORA 시설 탈출 방 생성 화면',caption:'실제 게임 캡처 · 6~10인 초기 프로토타입 0.1 메뉴'}],videos:[]
    },
    {
      id:'mafia',title:'정글의 마지막 식량',subtitle:'공유하는 식량, 숨겨진 스파이. 먹봇의 원형.',
      engine:'Unity 6 · C#',category:'추리',status:'멀티플레이 빌드 · 먹봇으로 발전',year:'2026',
      description:'정글에서 공용 식량을 두고 생존하는 6인 스파이 게임. 낮과 밤, 허기와 식량 채집이 협력과 의심의 조건이 됩니다. 이 규칙을 로봇·에너지 테마로 이어 만든 최종 게임이 먹봇입니다.',
      details:[
        {title:'게임 흐름',text:'정글의 원정대가 공용 식량을 나누며 구조를 기다리는 6인 스파이 생존 게임입니다. 첫날 안내 문구는 \'첫째 날. 식량을 찾고, 야영지에서 나누세요. 구조까지 4일.\'이며, 4일 동안 낮과 밤이 이어집니다. 화면 상단에는 일차와 남은 낮 시간(1일 / 낮 48초), 아침 식량 보고(6개), 구조까지 남은 날이 표시됩니다.'},
        {title:'허기와 식량',text:'플레이어마다 개인 허기(캡처에서는 96/100)와 가방이 있습니다. 열매 같은 식량을 채집해 야영지의 \'공용 식량\' 상자에 반납하고, 필요할 때 1개 또는 3개씩 먹습니다. 과식도 규칙에 포함되어 있어, 허기와 식량 채집이 그대로 협력과 의심의 조건이 됩니다.'},
        {title:'스파이',text:'캡처는 스파이 역할로 접속한 화면으로, \'당신은 스파이입니다\'와 함께 목표 \'모두를 굶기세요\'가 표시됩니다. 스파이의 목표는 원정대와 함께 살아남는 것이 아니라 원정대 전체를 굶주리게 하는 것입니다.'},
        {title:'조작과 접속',text:'조작은 WASD 이동, 우클릭 드래그 시점, E 채집·1개 먹기, Q 3개 먹기, F 반납입니다. 호스트와 게스트로 접속하며, 왼쪽 아래 \'원정대 대화\' 창에서 채팅합니다. 캡처는 TestHost와 TestGuest 두 클라이언트가 야영지에 접속한 개발 테스트 장면입니다.'},
        {title:'먹봇으로 이어진 점',text:'이 게임의 규칙을 로봇·에너지 테마로 바꿔 이어 만든 최종 게임이 팀 우당탕의 먹봇입니다. 먹봇에서는 공용 식량 대신 에너지 셀 납품과 공용 충전소, 개인 허기 대신 배터리가 쓰이고, 스파이 자리는 다른 로봇의 에너지를 빼앗는 먹봇이 맡습니다.'},
        {title:'확인 범위',text:'이 PC에는 정글의 마지막 식량의 소스와 빌드가 없어, 이전 PC에서 작성한 항목 설명과 개발 테스트 캡처 1장을 바탕으로 정리했습니다. 밤에 진행되는 방식, 과식의 구체적인 효과, 승리 조건은 확인하지 못했습니다. 생존마피아 트레일러 3종은 로봇 콘셉트의 AI 시네마틱이어서 이 게임의 자료로 쓰지 않았습니다.'}
      ],
      features:['6인 스파이 생존 규칙','4일간의 낮·밤 진행','식량 채집·허기·과식','호스트·게스트 접속'],
      images:[{src:'media/mafia.webp',alt:'정글의 마지막 식량 3D 플레이 화면',caption:'실제 개발 캡처 · 호스트/게스트 연결 화면'}],videos:[]
    },
    {
      id:'arena-fate',title:'낙하한 자',subtitle:'ARENA OF FATE. 운명에서 전술로.',
      engine:'Unity 6 · URP',category:'시뮬레이션',status:'Windows 빌드',year:'2026',
      description:'무작위 출신과 자산, 전직을 받고 투기장에 들어가는 탑다운 자동전투 게임. 이후 RIFT MANAGER로 이어진 전작입니다.',
      details:[
        {title:'게임 개요',text:'무작위 출신과 자산, 전직을 받은 \'소환된 자(THE SUMMONED)\'가 투기장에서 살아남는 탑다운 자동전투 게임입니다. 전투는 자동으로 진행되고, 플레이어는 태세 전환과 스킬로 흐름을 바꿉니다. 이후 5 대 5 자동 공성 게임 RIFT MANAGER로 확장된 전작입니다.'},
        {title:'출신과 기록',text:'캐릭터마다 출신, 성별·나이·전직, 처음 재산이 정해집니다. 캡처의 캐릭터는 \'상인 가문\' 출신의 20세 남성 전직 병사이고, 처음 재산과 소지금은 116,200원입니다. 출신은 6종이며 각각 패시브와 생존기술을 가집니다. 상인 가문의 고유 특성 \'흥정의 감각\'은 무기 구매와 상점 강화 비용을 15% 줄여 줍니다.'},
        {title:'투기장 전투',text:'투기장에서는 \'모든 전사는 서로의 적\'이며, 내 캐릭터는 청록색 원으로 표시됩니다. 캡처에는 라운드 1, 생존 시간 7초, 남은 상대 3명, 처치 1명이 표시됩니다. 적 머리 위에는 \'기회주의형\', \'견제형\' 같은 전투 AI 성향이 붙고, 적은 최대 8명까지 등장합니다. 상단에는 관중 환호(45/100)와 선물(0/2) 게이지가 있습니다.'},
        {title:'태세와 스킬',text:'[1] 공격 태세는 적을 적극 추격하고 공격력이 22% 오르며 빠르게 공격합니다. [2] 방어 태세는 거리를 벌리고 반격하며, 전환 직후 0.45초 동안 받아치기가 가능하고 재사용 대기시간은 2초입니다. [Q] 미끼 동전은 3초 동안 적들끼리 싸우게 만들고, 소지금을 쓰지 않으며 재사용 대기시간은 12초입니다. 캡처의 장착 무기 \'낡은 검\'(일반)은 방어 전환 직후 받아치기에 성공하면 체력을 회복합니다.'},
        {title:'보상과 죽음',text:'무기 상점과 전투 보상으로 장비를 바꿉니다. 사망하면 그 런은 초기화되고, 화면에는 \'죽음은 끝입니다. 다음 생은 새 출신으로.\'라는 문구가 적혀 있습니다.'},
        {title:'확인 범위',text:'이 PC에는 소스와 빌드가 없어, 이전 PC에서 작성한 항목 설명과 실제 게임 캡처 1장을 바탕으로 정리했습니다. 나머지 5종 출신의 이름과 특성, 무기 종류, 라운드 구성, 관중 환호와 선물의 효과는 확인하지 못해 적지 않았습니다.'}
      ],
      features:['6종 출신 패시브와 생존기술','태세 전환형 자동전투','최대 8명의 적·전투 AI','무기 상점·보상·사망 시 런 초기화'],
      images:[{src:'media/arena-fate.webp',alt:'낙하한 자 투기장 전투와 캐릭터 정보',caption:'실제 게임 캡처 · 투기장 자동전투'}],videos:[]
    },
    {
      id:'dice-man',title:'DICE MAN',subtitle:'운명을 굴리고, 다음 전투를 준비하다.',
      engine:'Unity 6 · 세로형 UI',category:'RPG',status:'개발 프로젝트 · 모바일 실기기 미검증',year:'2026',
      description:'선택형 이야기 게임 열 번째 밤에서 출발해 주사위 전투와 영구 성장으로 발전한 프로젝트. 성격·직업·종족을 선택하고 D6 결과로 전투를 진행합니다.',
      details:[
        {title:'개발 이력',text:'선택형 이야기 웹 프로토타입 \'열 번째 밤\'에서 출발해, 주사위 전투와 영구 성장을 갖춘 세로형 RPG로 발전한 프로젝트입니다. 메뉴 화면의 부제는 \'주사위로 써 내려가는 모험\'이며, UI는 낡은 두루마리 질감으로 꾸몄습니다.'},
        {title:'캐릭터 만들기',text:'시작할 때 성격, 직업, 종족을 차례로 선택합니다. 캡처의 캐릭터는 \'다혈질 · 성직자 · 드워프\' 조합입니다. 첫 전투 기준으로 레벨 1, 체력 100, 물리/마법 16/10, 방어력 2입니다.'},
        {title:'D6 전투',text:'전투에서는 주사위(D6)를 굴려 나온 눈으로 행동이 정해집니다. 1 물리, 2 마법, 3 방어(쉴드), 4 상태, 5 아이템, 6 추가 턴입니다. 캡처는 \'오래된 성문\'에서 성문 파수꾼(체력 50)과 싸우는 첫 전투로, \'남은 주사위 1회\'가 표시됩니다. 모험에서 얻은 물건은 전투 화면 아래의 보유 아이템 칸에 모입니다.'},
        {title:'보스와 황금 주사위',text:'3전투마다 보스전이 열립니다. 일반 주사위와 별도로 황금 주사위가 있습니다.'},
        {title:'영구 성장',text:'메뉴의 \'주사위 성장 · 룰렛\'에서 슬롯머신 방식으로 영구 성장을 얻습니다. 메뉴 설명에 따르면 도달한 라운드만큼 보석이 남고, 캡처에는 \'보석 0개 · 다음 룰렛 1개\'가 표시됩니다. 한 번의 모험이 끝나도 보석과 성장이 남아 다음 도전으로 이어집니다.'},
        {title:'확인 범위',text:'이 PC에는 소스와 빌드가 없어, 이전 PC에서 작성한 항목 설명과 개발 캡처 2장(메뉴·전투)을 바탕으로 정리했습니다. 성격·직업·종족의 전체 목록, 상태·아이템 눈의 구체적인 효과, 황금 주사위와 룰렛 보상의 내용은 확인하지 못했습니다. 모바일 실기기에서의 실행도 검증되지 않았습니다.'}
      ],
      features:['성격·직업·종족 3단계 선택','물리·마법·쉴드·상태·아이템·추가턴 D6','황금 주사위·3전투마다 보스','슬롯머신 기반 영구 성장'],
      history:['열 번째 밤 · 선택형 이야기 웹 프로토타입','DICE MAN · 주사위 전투와 영구 성장으로 확장'],
      images:[{src:'media/dice-combat.webp',alt:'Dice Man 주사위 전투 화면',caption:'실제 개발 캡처 · 주사위 전투'},{src:'media/dice-menu.webp',alt:'Dice Man 메뉴 화면',caption:'실제 개발 캡처 · 메뉴'}],videos:[]
    }
  ],
  notes: [
    {title:'무엇을 담았나', text:'직접 만든 게임과 프로토타입 23개를 한 항목씩 정리했습니다. 같은 게임의 백업·빌드 사본·이전 버전은 하나로 묶고, 각 항목의 개발 이력에 기록했습니다.'},
    {title:'화면의 출처', text:'모든 이미지와 영상 설명에 출처를 적었습니다. 직접 실행 캡처, 플레이 녹화, 프로젝트 안의 기존 캡처, 에디터·자동 검증 화면, 시네마틱·렌더를 구분하며, 다른 게임의 화면을 대신 쓰지 않습니다.'},
    {title:'상태 표기', text:'상태 칸은 확인한 수준만 적습니다. 빌드를 직접 실행했는지, 녹화만 있는지, 소스만 있는지 구분하며 출시·실기기 검증을 하지 않은 작업은 그렇게 표기합니다.'},
    {title:'AI 도구 활용', text:'여러 프로젝트에서 VARCO 3D 생성 모델, 이미지 생성 아트, AI 코딩 에이전트를 활용했습니다. 해당 프로젝트의 제작 도구 항목과 캡션에 밝혔습니다.'},
    {title:'팀 프로젝트', text:'3분, 먹봇, FINAL VERDICT는 팀 우당탕의 프로젝트이며, 그래픽·컨셉아트·프로토타입 제작을 맡았습니다. 먹봇은 정글의 마지막 식량을 이어서 만든 최종 게임입니다.'},
    {title:'제외한 폴더', text:'Unity·Unreal 빈 템플릿과 공식 샘플(HDRP 3D Sample, URP 샘플, Tanks 튜토리얼), 에셋 스토어 샘플(Time Ghost), 외부 오픈소스 도구(pixelfx), 제3자 IP 팬게임 배포본과 상용 게임 저장 폴더는 창작 게임 수에 넣지 않았습니다.', kind:'sample'}
  ]
};
