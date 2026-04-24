
const logger = require('../utils/logger');

/**
 * Role hierarchy levels
 * Higher number = more permissions
 */
const ROLE_HIERARCHY = {
    admin: 3,
    manager: 2,
    staff: 1,
    viewer: 0
};

/**
 * Permission matrix
 * Defines what each role can do
 */
const PERMISSIONS = {
    // Category permissions
    'category:create': ['admin', 'manager'],
    'category:update': ['admin', 'manager'],
    'category:delete': ['admin'],
    'category:view': ['admin', 'manager', 'staff', 'viewer'],

    // Product permissions
    'product:create': ['admin', 'manager'],
    'product:update': ['admin', 'manager'],
    'product:delete': ['admin'],
    'product:view': ['admin', 'manager', 'staff', 'viewer'],

    // Inventory permissions
    'inventory:stock-in': ['admin', 'manager'],
    'inventory:stock-out': ['admin', 'manager', 'staff'],
    'inventory:view': ['admin', 'manager', 'staff', 'viewer'],
    'inventory:adjust': ['admin', 'manager'],

    // Supplier permissions
    'supplier:create': ['admin', 'manager'],
    'supplier:update': ['admin', 'manager'],
    'supplier:delete': ['admin'],
    'supplier:view': ['admin', 'manager', 'staff', 'viewer'],

    // User permissions
    'user:create': ['admin'],
    'user:update': ['admin'],
    'user:delete': ['admin'],
    'user:view': ['admin', 'manager'],
    'user:role-change': ['admin'],

    // Report permissions
    'report:view': ['admin', 'manager'],
    'report:export': ['admin', 'manager'],
    'report:schedule': ['admin', 'manager'],

    // System permissions
    'system:settings': ['admin'],
    'system:logs': ['admin'],
    'system:backup': ['admin']
};

/**
 * Check if a role has a specific permission
 */
const hasPermission = (role, permission) => {
    const allowedRoles = PERMISSIONS[permission];
    if (!allowedRoles) return false;
    return allowedRoles.includes(role);
};

/**
 * Check if a role has sufficient hierarchy level
 */
const hasMinRoleLevel = (userRole, requiredRole) => {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
    return userLevel >= requiredLevel;
};

/**
 * Main restrictTo middleware
 * @param {...string} roles - Allowed roles
 * @returns {Function} Express middleware
 */
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // Check if user exists on request
        if (!req.user) {
            logger.warn('Access denied: No user found on request');
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'You are not logged in. Please log in to access this resource.'
                }
            });
        }

        const userRole = req.user.role.toUpperCase();

        // Check if user role is allowed
        const normalizedRoles = roles.flat().map(r => String(r).toUpperCase());
        if (!normalizedRoles.includes(userRole)) {
            logger.warn(`Access denied: User ${req.user.id} with role ${userRole} attempted to access ${req.originalUrl}. Required roles: ${normalizedRoles.join(', ')}`);

            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Required role: ${normalizedRoles.join(' or ')}. Your role: ${userRole}`,
                    requiredRoles: normalizedRoles,
                    yourRole: userRole
                }
            });
        }

        // Log successful access (optional - for debugging)
        if (process.env.NODE_ENV === 'development') {
            logger.debug(`Access granted: ${req.user.role} accessed ${req.method} ${req.originalUrl}`);
        }

        next();
    };
};

/**
 * Restrict by minimum role level
 * @param {string} minRole - Minimum role required (admin, manager, staff, viewer)
 * @returns {Function} Express middleware
 */
const restrictByLevel = (minRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'You are not logged in.'
                }
            });
        }

        const userRole = req.user.role.toLowerCase();

        if (!hasMinRoleLevel(userRole, minRole)) {
            logger.warn(`Access denied: User ${req.user.id} with role ${userRole} does not meet minimum level ${minRole}`);

            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Minimum required role: ${minRole}. Your role: ${userRole}`,
                    requiredLevel: minRole,
                    yourRole: userRole
                }
            });
        }

        next();
    };
};

/**
 * Restrict by specific permission
 * @param {string} permission - Permission to check (e.g., 'product:create')
 * @returns {Function} Express middleware
 */
const restrictByPermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'You are not logged in.'
                }
            });
        }

        const userRole = req.user.role.toLowerCase();

        if (!hasPermission(userRole, permission)) {
            logger.warn(`Permission denied: User ${req.user.id} with role ${userRole} lacks permission ${permission}`);

            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `You don't have permission to perform this action. Required permission: ${permission}`,
                    requiredPermission: permission,
                    yourRole: userRole
                }
            });
        }

        next();
    };
};

/**
 * Restrict to own resource or admin
 * @param {Function} getResourceUserId - Function to extract user ID from resource
 * @returns {Function} Express middleware
 */
const restrictToOwnResource = (getResourceUserId) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'You are not logged in.'
                    }
                });
            }

            // Admin can access any resource
            if (req.user.role === 'admin') {
                return next();
            }

            // Get the user ID associated with the resource
            const resourceUserId = await getResourceUserId(req);

            if (req.user.id !== resourceUserId) {
                logger.warn(`Access denied: User ${req.user.id} tried to access resource belonging to user ${resourceUserId}`);

                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: 'You can only access your own resources.'
                    }
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Combined middleware - requires all conditions
 * @param {Array} middlewares - Array of middleware functions
 * @returns {Function} Express middleware
 */
const combineRestrictions = (...middlewares) => {
    return async (req, res, next) => {
        try {
            for (const middleware of middlewares) {
                await new Promise((resolve, reject) => {
                    middleware(req, res, (err) => {
                        if (err) reject(err);
                        resolve();
                    });
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Check if user can access resource based on multiple conditions
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware
 */
const checkAccess = (options) => {
    const { roles, permissions, minLevel, customCheck } = options;

    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'UNAUTHORIZED',
                        message: 'You are not logged in.'
                    }
                });
            }

            const userRole = req.user.role.toLowerCase();

            // Check roles
            if (roles && roles.length > 0 && !roles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: `Access denied. Required role: ${roles.join(' or ')}`
                    }
                });
            }

            // Check minimum level
            if (minLevel && !hasMinRoleLevel(userRole, minLevel)) {
                return res.status(403).json({
                    success: false,
                    error: {
                        code: 'FORBIDDEN',
                        message: `Access denied. Minimum required level: ${minLevel}`
                    }
                });
            }

            // Check permissions
            if (permissions && permissions.length > 0) {
                const hasRequiredPermissions = permissions.some(permission =>
                    hasPermission(userRole, permission)
                );

                if (!hasRequiredPermissions) {
                    return res.status(403).json({
                        success: false,
                        error: {
                            code: 'FORBIDDEN',
                            message: `Access denied. Required permission: ${permissions.join(' or ')}`
                        }
                    });
                }
            }

            // Custom check
            if (customCheck && typeof customCheck === 'function') {
                const result = await customCheck(req, req.user);
                if (!result.allowed) {
                    return res.status(403).json({
                        success: false,
                        error: {
                            code: 'FORBIDDEN',
                            message: result.message || 'Access denied by custom rule'
                        }
                    });
                }
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Get user's role hierarchy level
 */
const getUserRoleLevel = (user) => {
    return ROLE_HIERARCHY[user?.role] || 0;
};

/**
 * Check if user is admin (convenience function)
 */
const isAdmin = (user) => {
    return user?.role?.toLowerCase() === 'admin';
};

/**
 * Check if user is manager or above
 */
const isManagerOrAbove = (user) => {
    return hasMinRoleLevel(user?.role, 'manager');
};

/**
 * Check if user is staff or above
 */
const isStaffOrAbove = (user) => {
    return hasMinRoleLevel(user?.role, 'staff');
};

// Export all middleware and utilities
module.exports = {
    // Main middleware
    restrictTo,
    restrictByLevel,
    restrictByPermission,
    restrictToOwnResource,
    combineRestrictions,
    checkAccess,

    // Utility functions
    hasPermission,
    hasMinRoleLevel,
    getUserRoleLevel,
    isAdmin,
    isManagerOrAbove,
    isStaffOrAbove,

    // Constants
    ROLE_HIERARCHY,
    PERMISSIONS
};