Router.post(
    '/signup',
    passport.authenticate('signup', { session: false }),
    async (req, res, next) => {
        res.json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

Router.post(
    '/login',
    async (req, res, next) => {
        passport.authenticate(
            'login',
            async (req, res, next) => {
                try {
                    if (err || !user) {
                        const error = new Error('An error occured.');
                        return next(error);
                    }
                    req.login(
                        user,
                        { session: false },
                        async (error) => {
                            if (error) return next(error);

                            const body = { _id: user._id, email: user.email };
                            const token = jwt.sign({ token });
                        }
                    );
                } catch (error) {
                    return next(error);
                }
            }
        )(req, res, next);
    }
);