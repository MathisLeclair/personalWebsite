import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import Level27Plan from './Level27Plan'
import Level28Plan from './Level28Plan'

export default function FloorPlan({ selectedRoom, onRoomSelect }) {
  const [level, setLevel] = useState(28)

  return (
    <Box>
      {/* Level switcher */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs
          value={level}
          onChange={(_, v) => setLevel(v)}
          textColor="inherit"
          TabIndicatorProps={{ style: { backgroundColor: '#4fc3f7' } }}
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(79,195,247,0.55)',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              letterSpacing: '0.08em',
              fontSize: '0.75rem',
              border: '1px solid rgba(79,195,247,0.2)',
              mx: 0.5,
              borderRadius: '4px',
              '&.Mui-selected': {
                color: '#4fc3f7',
                borderColor: '#4fc3f7',
              },
            },
          }}
        >
          <Tab label="LEVEL 28 — GATE OPS" value={28} />
          <Tab label="LEVEL 27 — ADMIN" value={27} />
        </Tabs>
      </Box>

      {/* SVG floor plan */}
      <Box
        sx={{
          borderRadius: '8px',
          border: '1px solid rgba(79,195,247,0.18)',
          overflow: 'hidden',
          background: '#060f1e',
          boxShadow: '0 0 40px rgba(79,195,247,0.06)',
        }}
      >
        {level === 27 ? (
          <Level27Plan selectedRoom={selectedRoom} onRoomSelect={onRoomSelect} />
        ) : (
          <Level28Plan selectedRoom={selectedRoom} onRoomSelect={onRoomSelect} />
        )}
      </Box>

      {/* Hint */}
      <Box sx={{ textAlign: 'center', mt: 1.5, color: 'rgba(179,229,252,0.4)', fontSize: '0.72rem', letterSpacing: '0.06em' }}>
        CLICK A ROOM TO ACCESS CLASSIFIED INFORMATION
      </Box>
    </Box>
  )
}
