# BrzoZborle Development Rules

## Code Organization
- All components go in `src/components/`
- Game logic lives in `src/lib/`
- Constants are stored in `src/constants/`
- Modal components go in `src/components/modals/`

## TypeScript Guidelines
- Use strict typing (no `any`)
- Define interfaces for all props
- Use type Props = {} for component props
- Use enums for game states

## Component Structure
- Use functional components
- Keep components small and focused
- Extract reusable logic to custom hooks
- Follow React best practices

## Game Modes

### Classic Mode ("КЛАСИК")
- Traditional Wordle gameplay
- No time limit
- Full hint visibility
- Standard keyboard feedback

### Timed Mode ("ТЕМПИРАНО")
- 3-minute time limit
- Full hint visibility
- Game ends on:
  - Word guessed correctly
  - Time expires
  - All attempts used

### Hard Mode ("ТЕШКОТО")
- 3-minute base time
- -20 second penalty per wrong guess
- Limited hints:
  - Only shows correct letters in correct positions
  - No keyboard feedback
  - No yellow hints for misplaced letters

## Git Workflow
- Commit messages in English
- One feature per branch
- Test before pushing
- Keep commits atomic

## Testing Requirements
- Test all game modes
- Verify timer functionality
- Test penalties in hard mode
- Check game over conditions