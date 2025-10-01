# Contributing to NGX-Chronica

First off, thank you for considering contributing to NGX-Chronica! 🎉

It's people like you that make NGX-Chronica such a great tool for the Angular community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- Use the bug report template
- Provide a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples and code samples
- Describe the behavior you observed and what you expected
- Include screenshots or GIFs if applicable
- Specify your Angular version, NGX-Chronica version, and browser

### Suggesting Features

Feature suggestions are welcome! Please:

- Use the feature request template
- Provide a clear and detailed explanation of the feature
- Explain why this feature would be useful
- Provide examples of how it would be used
- Consider if this fits the project's scope and goals

### Improving Documentation

Documentation improvements are always appreciated:

- Fix typos or grammatical errors
- Add missing examples
- Clarify confusing sections
- Add new guides or tutorials
- Improve API documentation

### Submitting Code Changes

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Add tests** for any new functionality
4. **Update documentation** if needed
5. **Ensure tests pass** by running `npm test`
6. **Lint your code** with `npm run lint`
7. **Submit a pull request** with a clear description

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 19+
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ngx-chronica.git
cd ngx-chronica

# Add upstream remote
git remote add upstream https://github.com/yourusername/ngx-chronica.git

# Install dependencies
npm install

# Start development server (documentation site)
npm start

# Build the library
npm run build:lib

# Run tests
npm test

# Run linter
npm run lint
```

### Project Structure

```
ngx-chronica/
├── projects/chronica/          # Library source code
│   ├── src/lib/
│   │   ├── components/         # Component implementations
│   │   ├── models/             # TypeScript interfaces
│   │   ├── utils/              # Utility functions
│   │   └── chronica.module.ts  # Optional NgModule
│   └── public-api.ts           # Public API exports
├── src/                        # Documentation website
│   ├── app/
│   │   ├── components/         # Demo components
│   │   └── features/           # Feature pages
│   └── assets/                 # Static assets
└── .github/                    # GitHub configuration
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork** with the latest changes from upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes** and commit them using conventional commits

4. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

### PR Requirements

- ✅ All tests pass (`npm test`)
- ✅ Code is linted (`npm run lint`)
- ✅ New features have tests
- ✅ Documentation is updated
- ✅ Commit messages follow convention
- ✅ PR description clearly explains changes
- ✅ No merge conflicts with main branch

### PR Review Process

1. A maintainer will review your PR within 3-5 business days
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release!

## 💻 Coding Standards

### TypeScript

- Use **TypeScript strict mode**
- Provide **explicit return types** for all functions
- Use **interfaces** for object types
- Avoid `any` type - use proper typing
- Use **readonly** where applicable

```typescript
// ✅ Good
function formatDate(date: Date, format: string): string {
  // implementation
}

// ❌ Bad
function formatDate(date: any, format: any) {
  // implementation
}
```

### Angular

- Use **standalone components** by default
- Implement **OnPush change detection**
- Follow **Angular style guide**
- Use **ControlValueAccessor** for form components
- Add **ARIA attributes** for accessibility

```typescript
// ✅ Good
@Component({
  selector: 'chronica-datepicker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class ChronicaDatepickerComponent implements ControlValueAccessor {
  // implementation
}
```

### CSS

- Use **CSS custom properties** for theming
- Follow **BEM naming convention** for classes
- Ensure **responsive design**
- Support **dark mode**

```css
/* ✅ Good */
.chronica-datepicker {
  --chronica-primary: var(--chronica-primary-500);
}

.chronica-datepicker__header {
  background: var(--chronica-primary);
}
```

### Accessibility

- Add proper **ARIA labels**
- Support **keyboard navigation**
- Ensure **screen reader compatibility**
- Maintain **color contrast ratios**
- Test with **accessibility tools**

## 📝 Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(datepicker): add keyboard navigation support

- Add arrow key navigation
- Add Enter/Space for selection
- Add Escape to close popup

Closes #123

fix(time-picker): resolve 12h/24h conversion bug

The conversion was incorrectly handling midnight (00:00).
Now properly converts 12 AM to 00:00 in 24h format.

Fixes #456

docs(readme): update installation instructions

Added npm and yarn installation examples.
Clarified peer dependency requirements.

test(duration): add validation tests

Added comprehensive tests for min/max duration validation.
Coverage increased from 85% to 92%.
```

## 🧪 Testing Guidelines

### Unit Tests

- Write tests for **all new features**
- Maintain **>90% code coverage**
- Test **edge cases** and **error conditions**
- Use **descriptive test names**

```typescript
describe('ChronicaDatepickerComponent', () => {
  describe('Date Selection', () => {
    it('should emit dateSelected event when valid date is clicked', () => {
      // Arrange
      const component = createComponent();
      const spy = jest.spyOn(component.dateSelected, 'emit');
      
      // Act
      component.selectDate(15);
      
      // Assert
      expect(spy).toHaveBeenCalledWith(expect.any(Date));
    });

    it('should not select disabled dates', () => {
      // Test implementation
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- datepicker.component.spec.ts
```

## 🎨 Component Development Checklist

When adding a new component:

- [ ] Create component in `projects/chronica/src/lib/components/`
- [ ] Implement `ControlValueAccessor` interface
- [ ] Add TypeScript interfaces to `models/`
- [ ] Export in `public-api.ts`
- [ ] Add to `ChronicaModule`
- [ ] Write comprehensive unit tests
- [ ] Add ARIA attributes for accessibility
- [ ] Support keyboard navigation
- [ ] Create demo page in `src/app/features/`
- [ ] Update documentation
- [ ] Add usage examples
- [ ] Test with all themes
- [ ] Test in all supported browsers

## 📚 Documentation Standards

### Code Comments

```typescript
/**
 * Generates a calendar month with all dates
 * @param year - The year to generate
 * @param month - The month to generate (0-11)
 * @param config - Calendar configuration options
 * @returns A ChronicaMonth object with weeks and dates
 */
static generateCalendarMonth(
  year: number,
  month: number,
  config: ChronicaCalendarConfig
): ChronicaMonth {
  // implementation
}
```

### README Updates

- Update component list if adding new component
- Add usage examples
- Update configuration tables
- Add to feature list

## 🐛 Debugging Tips

### Common Issues

1. **Tests failing**: Ensure you've run `npm install` after pulling latest changes
2. **Linter errors**: Run `npm run lint:fix` to auto-fix formatting issues
3. **Build errors**: Clear `dist/` folder and rebuild with `npm run build:lib`

### Useful Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Angular cache
npm run ng cache clean

# Build library in watch mode
npm run build:lib -- --watch
```

## 🏆 Recognition

Contributors will be:

- Listed in the [Contributors](https://github.com/yourusername/ngx-chronica/graphs/contributors) page
- Mentioned in release notes
- Added to the README acknowledgments section

## 📞 Getting Help

- 💬 [GitHub Discussions](https://github.com/yourusername/ngx-chronica/discussions) - Ask questions
- 🐛 [Issue Tracker](https://github.com/yourusername/ngx-chronica/issues) - Report bugs
- 📚 [Documentation](https://ngx-chronica.vercel.app) - Read guides

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to NGX-Chronica! 🎉
